import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Event } from '../../types';
import { saveOrUpdateEvent } from '../../utils/saveOrUpdateEvent';

describe('saveOrUpdateEvent', () => {
  let mockSaveEvent: any;
  let mockResetForm: any;

  beforeEach(() => {
    mockSaveEvent = vi.fn();
    mockResetForm = vi.fn();
  });

  it('📌 saveEvent가 실행된 후 resetForm이 호출되는지 확인', async () => {
    const eventData: Event = {
      id: '1',
      title: '테스트 일정',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '테스트 일정 설명',
      location: '회의실 C',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    };

    await saveOrUpdateEvent(eventData, mockSaveEvent, mockResetForm);

    expect(mockSaveEvent).toHaveBeenCalledWith(eventData);
    expect(mockResetForm).toHaveBeenCalled();
  });
});
