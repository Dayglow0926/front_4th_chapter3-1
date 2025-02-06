import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

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
    date: '2025-02-21',
    startTime: '11:00',
    endTime: '12:00',
    description: '기존 팀 미팅aa, 점심',
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

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  expect(result.current.filteredEvents).toEqual([events[1], events[2]]);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  act(() => result.current.setSearchTerm('이벤트 2'));

  expect(result.current.filteredEvents).toEqual([events[1]]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  act(() => result.current.setSearchTerm('이벤트 2'));
  expect(result.current.filteredEvents).toEqual([events[1]]);

  act(() => result.current.setSearchTerm('기존 팀 미팅'));
  expect(result.current.filteredEvents).toEqual([events[1], events[2]]);

  act(() => result.current.setSearchTerm('회의실'));
  expect(result.current.filteredEvents).toEqual([events[1], events[2]]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result: monthResult } = renderHook(() => useSearch(events, new Date(), 'month'));
  const { result: weekResult } = renderHook(() => useSearch(events, new Date(), 'week'));

  expect(monthResult.current.filteredEvents).toEqual([events[1], events[2]]);
  expect(weekResult.current.filteredEvents).toEqual([]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(events, new Date(), 'month'));

  act(() => result.current.setSearchTerm('회의'));
  expect(result.current.filteredEvents).toEqual([events[1], events[2]]);

  act(() => result.current.setSearchTerm('점심'));
  expect(result.current.filteredEvents).toEqual([events[2]]);
});
