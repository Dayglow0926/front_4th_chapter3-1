import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import App from '../App';
import { server } from '../setupTests';
import { Event, EventForm } from '../types';

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2024-10-15 8:50'));
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

const renderApp = () => {
  return render(
    <ChakraProvider>
      <App />
    </ChakraProvider>
  );
};

describe('일정 CRUD 및 기본 기능', () => {
  beforeEach(() => {
    renderApp();
  });

  const event: EventForm = {
    title: '뉴 이벤트 1',
    date: '2024-10-16',
    startTime: '11:00',
    endTime: '12:00',
    description: '기존 팀 미팅AA',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 10,
  };

  it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
    // ! HINT. event를 추가 제거하고 저장하는 로직을 잘 살펴보고, 만약 그대로 구현한다면 어떤 문제가 있을 지 고민해보세요.
    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const desciptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categorySelect = screen.getByLabelText('카테고리');
    const repeatScheduleCheckBox = screen.getByLabelText('반복 일정');
    const notificationSelect = screen.getByLabelText('알림 설정');
    const repeatTypeSelect = screen.getByLabelText('반복 유형');
    const repeatTntervalInput = screen.getByLabelText('반복 간격');
    const repeatEndDateInput = screen.getByLabelText('반복 종료일');
    const addScheduleButton = screen.getByTestId('event-submit-button');

    await userEvent.type(titleInput, event.title);
    await userEvent.type(dateInput, event.date);
    await userEvent.type(startTimeInput, event.startTime);
    await userEvent.type(endTimeInput, event.endTime);
    await userEvent.type(desciptionInput, event.description);
    await userEvent.type(locationInput, event.location);
    await userEvent.selectOptions(categorySelect, event.category);
    await userEvent.selectOptions(notificationSelect, String(event.notificationTime));
    await userEvent.selectOptions(categorySelect, event.category);
    await userEvent.click(repeatScheduleCheckBox);
    // expect(repeatScheduleCheckBox).not.toBeChecked();
    // expect(checkbox).toBeChecked();

    if (repeatTypeSelect) {
      await userEvent.selectOptions(repeatTypeSelect, 'daily');

      await userEvent.type(repeatTntervalInput, String(event.repeat.interval));

      if (event.repeat.endDate) {
        await userEvent.type(repeatEndDateInput, String(event.repeat.endDate));
      }
    }

    await userEvent.click(addScheduleButton);

    await waitFor(async () => {
      const eventListContainer = screen.getByTestId('event-list');
      expect(await within(eventListContainer).findByText(event.title)).toBeInTheDocument();
    });
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {});

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {});
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {});

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {});

  it('월별 뷰에 일정이 없으면, 일정이 표시되지 않아야 한다.', async () => {});

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {});

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {});
});

describe('검색 기능', () => {
  it('검색 결과가 없으면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {});

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {});

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {});
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
