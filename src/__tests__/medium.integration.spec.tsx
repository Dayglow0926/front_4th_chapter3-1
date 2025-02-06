import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within, act, waitFor } from '@testing-library/react';
import { UserEvent, userEvent } from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { ReactElement } from 'react';

import App from '../App';
import { server } from '../setupTests';
import { Event, EventForm } from '../types';
import { events } from '../__mocks__/response/events.json' assert { type: 'json' };
import {
  setupMockHandlerCreation,
  setupMockHandlerDeletion,
  setupMockHandlerUpdating,
} from '../__mocks__/handlersUtils';

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date('2024-10-01 8:50'));
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

    await act(async () => {
      const eventListContainer = screen.getByTestId('event-list');
      expect(await within(eventListContainer).findByText(event.title)).toBeInTheDocument();
    });
  });

  it('기존 일정의 세부 정보를 수정하고 변경사항이 정확히 반영된다', async () => {
    setupMockHandlerUpdating(events as Event[]);

    const updateEventData: Event = {
      ...(events[0] as Event),
      title: '업데이트된 title',
    };

    const eventListContainer = screen.getByTestId('event-list');

    await waitFor(async () => {
      expect(await within(eventListContainer).findByText(events[0].title)).toBeInTheDocument();
      const editButton = within(eventListContainer).getAllByLabelText(/Edit event/i);
      await userEvent.click(editButton[0]);
    });

    const titleInput = screen.getByLabelText('제목');
    const dateInput = screen.getByLabelText('날짜');
    const startTimeInput = screen.getByLabelText('시작 시간');
    const endTimeInput = screen.getByLabelText('종료 시간');
    const desciptionInput = screen.getByLabelText('설명');
    const locationInput = screen.getByLabelText('위치');
    const categorySelect = screen.getByLabelText('카테고리');

    const notificationSelect = screen.getByLabelText('알림 설정');
    const updateScheduleButton = screen.getByTestId('event-submit-button');

    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, updateEventData.title);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, updateEventData.date);
    await userEvent.clear(startTimeInput);
    await userEvent.type(startTimeInput, updateEventData.startTime);
    await userEvent.clear(endTimeInput);
    await userEvent.type(endTimeInput, updateEventData.endTime);
    await userEvent.clear(desciptionInput);
    await userEvent.type(desciptionInput, updateEventData.description);
    await userEvent.clear(locationInput);
    await userEvent.type(locationInput, updateEventData.location);

    await userEvent.selectOptions(categorySelect, updateEventData.category);
    await userEvent.selectOptions(notificationSelect, String(updateEventData.notificationTime));

    await userEvent.click(updateScheduleButton);

    await act(async () => {
      expect(
        await within(eventListContainer).findByText(updateEventData.title)
      ).toBeInTheDocument();
    });
  });

  it('일정을 삭제하고 더 이상 조회되지 않는지 확인한다', async () => {
    setupMockHandlerDeletion(events as Event[]);
    const eventListContainer = screen.getByTestId('event-list');

    await waitFor(async () => {
      expect(await within(eventListContainer).findByText(events[0].title)).toBeInTheDocument();
    });

    const deleteButton = within(eventListContainer).getAllByLabelText(/Delete event/i);
    await userEvent.click(deleteButton[0]);

    await act(async () => {
      expect(within(eventListContainer).queryByText(events[0].title)).not.toBeInTheDocument();
    });
  });
});

describe('일정 뷰', () => {
  it('주별 뷰를 선택 후 해당 주에 일정이 없으면, 일정이 표시되지 않는다.', async () => {
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).queryByText(events[0].title)).not.toBeInTheDocument();
  });

  it('주별 뷰 선택 후 해당 일자에 일정이 존재한다면 해당 일정이 정확히 표시된다', async () => {
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'week');

    const viewNextButton = screen.getByLabelText('Next');
    await userEvent.click(viewNextButton);
    await userEvent.click(viewNextButton);

    const weekView = screen.getByTestId('week-view');
    expect(within(weekView).getByText(events[0].title)).toBeInTheDocument();
  });

  it('월별 뷰에 일정이 없면, 일정이 표시되지 않아야 한다.', async () => {
    renderApp();

    const viewNextButton = screen.getByLabelText('Next');
    await userEvent.click(viewNextButton);

    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).queryByText(events[0].title)).not.toBeInTheDocument();
  });

  it('월별 뷰에 일정이 정확히 표시되는지 확인한다', async () => {
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');
    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText(events[0].title)).toBeInTheDocument();
  });

  it('달력에 1월 1일(신정)이 공휴일로 표시되는지 확인한다', async () => {
    vi.setSystemTime(new Date('2024-01-01 8:50'));
    renderApp();

    const viewSelect = screen.getByLabelText('view');
    await userEvent.selectOptions(viewSelect, 'month');
    const monthView = screen.getByTestId('month-view');
    expect(within(monthView).getByText('신정')).toBeInTheDocument();
  });
});

describe('검색 기능', () => {
  it('검색 결과가 없면, "검색 결과가 없습니다."가 표시되어야 한다.', async () => {
    vi.setSystemTime(new Date('2024-01-01 8:50'));
    renderApp();

    const eventListContainer = screen.getByTestId('event-list');
    const searchInput = within(eventListContainer).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, '팀 회의');

    expect(within(eventListContainer).getByText('검색 결과가 없습니다.')).toBeInTheDocument();
  });

  it("'팀 회의'를 검색하면 해당 제목을 가진 일정이 리스트에 노출된다", async () => {
    const newEvents: Event[] = [
      {
        id: '1',
        title: '새로운 팀 회의',
        date: '2024-10-17',
        startTime: '11:00',
        endTime: '12:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    setupMockHandlerCreation(newEvents as Event[]);

    renderApp();

    const eventListContainer = screen.getByTestId('event-list');
    const searchInput = within(eventListContainer).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, '팀 회의');

    expect(within(eventListContainer).getByText('새로운 팀 회의')).toBeInTheDocument();
  });

  it('검색어를 지우면 모든 일정이 다시 표시되어야 한다', async () => {
    const newEvents: Event[] = [
      {
        id: '1',
        title: '새로운 팀 회의',
        date: '2024-10-17',
        startTime: '11:00',
        endTime: '12:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
      {
        id: '2',
        title: '기존회의',
        date: '2024-10-17',
        startTime: '11:00',
        endTime: '12:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ];

    setupMockHandlerCreation(newEvents as Event[]);

    renderApp();

    const eventListContainer = screen.getByTestId('event-list');
    const searchInput = within(eventListContainer).getByPlaceholderText('검색어를 입력하세요');

    await userEvent.type(searchInput, '팀 회의');

    expect(within(eventListContainer).getByText('새로운 팀 회의')).toBeInTheDocument();
    expect(within(eventListContainer).queryByText('기존회의')).not.toBeInTheDocument();

    await userEvent.clear(searchInput);

    expect(within(eventListContainer).getByText('새로운 팀 회의')).toBeInTheDocument();
    expect(within(eventListContainer).getByText('기존회의')).toBeInTheDocument();
  });
});

describe('일정 충돌', () => {
  it('겹치는 시간에 새 일정을 추가할 때 경고가 표시된다', async () => {});

  it('기존 일정의 시간을 수정하여 충돌이 발생하면 경고가 노출된다', async () => {});
});

it('notificationTime을 10으로 하면 지정 시간 10분 전 알람 텍스트가 노출된다', async () => {});
