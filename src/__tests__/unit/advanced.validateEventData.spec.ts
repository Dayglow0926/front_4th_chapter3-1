import { describe, it, expect, vi } from 'vitest';
import { validateEventData } from '../../utils/validateEventData';
import { useToast } from '@chakra-ui/react';

const fakeToast = vi.fn();

vi.mock('@chakra-ui/react', () => ({
  useToast: () => fakeToast,
}));

describe('validateEventData', () => {
  it('📌 필수 정보가 없으면 false를 반환하고 토스트 메시지를 띄운다', () => {
    const toast = useToast();
    const result = validateEventData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      startTimeError: '',
      endTimeError: '',
      toast,
    });

    expect(result).toBe(false);
    expect(fakeToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
      })
    );
  });

  it('📌 시간 오류가 있으면 false를 반환하고 토스트 메시지를 띄운다', () => {
    const toast = useToast();
    const result = validateEventData({
      title: '테스트 일정',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '08:00', // 종료 시간이 시작 시간보다 빠름
      startTimeError: '시간 오류',
      endTimeError: '',
      toast,
    });

    expect(result).toBe(false);
    expect(fakeToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
      })
    );
  });

  it('📌 올바른 데이터가 들어오면 true를 반환한다', () => {
    const toast = useToast();
    const result = validateEventData({
      title: '테스트 일정',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      startTimeError: '',
      endTimeError: '',
      toast,
    });

    expect(result).toBe(true);
    expect(fakeToast).not.toHaveBeenCalled();
  });
});
