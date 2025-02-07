import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../../__mocks__/handlersUtils.ts';
import { events } from '../../__mocks__/response/events.json';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { server } from '../../setupTests.ts';
import { Event } from '../../types.ts';

// vi.fn : 가짜함수 생성 ( 모킹 )
const fakeToast = vi.fn();

// vi.mock : 모듈을 가짜함수로 교체
vi.mock('@chakra-ui/react', () => ({
  useToast: () => fakeToast,
}));

// useEventOperations 기능 테스트
it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  const { result } = renderHook(() => useEventOperations(false));

  // 비동기로 로드되는 events 데이터가 예상값과 일치할 때까지 자동으로 대기 & 체크
  await waitFor(() => {
    expect(result.current.events).toEqual(events);
  });
});

// import { useToast } from '@chakra-ui/react'; 확인
it('정의된 이벤트 정보를 기준으로 적절하게 저장이 되고 toast가 정상적으로 호출된다.(저장)', async () => {
  setupMockHandlerCreation(events as Event[]);
  const { result } = renderHook(() => useEventOperations(false));

  const event: Event = {
    id: '2',
    title: '뉴 이벤트 1',
    date: '2025-02-07',
    startTime: '11:00',
    endTime: '12:00',
    description: '기존 팀 미팅AA',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  await act(async () => result.current.saveEvent(event));

  expect(result.current.events).toEqual([...events, event]);

  // toHaveBeenCalledWith 호출된 함수 인자가 동일한지 확인
  expect(fakeToast).toHaveBeenCalledWith({
    title: '일정이 추가되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 되고 toast가 정상적으로 호출된다.(수정)", async () => {
  setupMockHandlerUpdating(events as Event[]);
  const { result } = renderHook(() => useEventOperations(true));
  const endTime = '15:00';

  const updateEventData: Event = {
    ...(events[0] as Event),
    title: '업데이트된 title',
    endTime,
  };

  await act(async () => {
    result.current.saveEvent(updateEventData);
  });

  expect(result.current.events.find((event) => events[0].id === event.id)).toEqual(updateEventData);
  expect(fakeToast).toHaveBeenCalledWith({
    title: '일정이 수정되었습니다.',
    status: 'success',
    duration: 3000,
    isClosable: true,
  });
});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {
  setupMockHandlerDeletion(events as Event[]);
  const { result } = renderHook(() => useEventOperations(true));

  await act(async () => {
    result.current.deleteEvent('1');
  });

  expect(result.current.events).toEqual([]);
  expect(fakeToast).toHaveBeenCalledWith({
    title: '일정이 삭제되었습니다.',
    status: 'info',
    duration: 3000,
    isClosable: true,
  });
});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {
  server.use(http.get('/api/events', () => HttpResponse.error()));

  renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(fakeToast).toHaveBeenCalledWith({
      title: '이벤트 로딩 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(true));
  const endTime = '15:00';

  const updateEventData: Event = {
    ...(events[0] as Event),
    id: '3',
    title: '업데이트된 title',
    endTime,
  };

  await act(async () => {
    result.current.saveEvent(updateEventData);
  });

  await waitFor(() => {
    expect(fakeToast).toHaveBeenCalledWith({
      title: '일정 저장 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {
  const { result } = renderHook(() => useEventOperations(true));

  await act(async () => {
    result.current.deleteEvent('3');
  });

  await waitFor(() => {
    expect(fakeToast).toHaveBeenCalledWith({
      title: '일정 삭제 실패',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  });
});
