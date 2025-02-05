import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

describe('getUpcomingEvents', () => {
  const events: Event[] = [
    {
      id: '1',
      title: '이벤트 1',
      date: '2024-07-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅AA',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '이벤트 2',
      date: '2025-02-14',
      startTime: '13:00',
      endTime: '14:00',
      description: '기존 팀 미팅Ab',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '이벤트 3',
      date: '2025-01-01',
      startTime: '13:00',
      endTime: '14:00',
      description: '기존 팀 미팅aa',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '4',
      title: '이벤트 4',
      date: '2025-01-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅BB',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    expect(getUpcomingEvents(events, new Date('2025-01-01 10:50'), [])).toEqual([
      {
        id: '4',
        title: '이벤트 4',
        date: '2025-01-01',
        startTime: '11:00',
        endTime: '12:00',
        description: '기존 팀 미팅BB',
        location: '회의실 B',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      },
    ]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    expect(getUpcomingEvents(events, new Date('2025-01-01 10:50'), ['4'])).toEqual([]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    expect(getUpcomingEvents(events, new Date('2025-01-01 10:40'), [])).toEqual([]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    expect(getUpcomingEvents(events, new Date('2025-01-01 11:00'), [])).toEqual([]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const event: Event = {
      id: '4',
      title: '이벤트 4',
      date: '2025-01-01',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅BB',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };
    expect(createNotificationMessage(event)).toBe('10분 후 이벤트 4 일정이 시작됩니다.');
  });
});
