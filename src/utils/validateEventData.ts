import { useToast } from '@chakra-ui/react';

export const validateEventData = ({
  title,
  date,
  startTime,
  endTime,
  startTimeError,
  endTimeError,
  toast,
}: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  startTimeError: string | null;
  endTimeError: string | null;
  toast: ReturnType<typeof useToast>;
}) => {
  if (!title || !date || !startTime || !endTime) {
    toast({
      title: '필수 정보를 모두 입력해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return false;
  }

  if (startTimeError || endTimeError) {
    toast({
      title: '시간 설정을 확인해주세요.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
    return false;
  }

  return true;
};
