import { describe, it, expect, vi } from 'vitest';

import { Event } from '../../types';
import { checkOverlappingEvents } from '../../utils/checkOverlappingEvents';

describe('checkOverlappingEvents', () => {
  const setOverlappingEvents = vi.fn();
  const setIsOverlapDialogOpen = vi.fn();

  const existingEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  it('📌 겹치는 일정이 있으면 false를 반환하고 다이얼로그를 연다', () => {
    const newEvent: Event = {
      id: '2',
      title: '새 일정',
      date: '2024-10-15',
      startTime: '09:30',
      endTime: '10:30',
      description: '겹치는 테스트 일정',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const result = checkOverlappingEvents(
      newEvent,
      existingEvents,
      setOverlappingEvents,
      setIsOverlapDialogOpen
    );

    expect(result).toBe(false);
    expect(setOverlappingEvents).toHaveBeenCalledWith(existingEvents);
    expect(setIsOverlapDialogOpen).toHaveBeenCalledWith(true);
  });

  it('📌 겹치는 일정이 없으면 true를 반환한다', () => {
    const newEvent: Event = {
      id: '2',
      title: '새 일정',
      date: '2024-10-15',
      startTime: '10:30',
      endTime: '11:30',
      description: '겹치지 않는 일정',
      location: '회의실 A',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    const result = checkOverlappingEvents(
      newEvent,
      existingEvents,
      setOverlappingEvents,
      setIsOverlapDialogOpen
    );

    expect(result).toBe(true);
    expect(setOverlappingEvents).not.toHaveBeenCalled();
    expect(setIsOverlapDialogOpen).not.toHaveBeenCalled();
  });
});
