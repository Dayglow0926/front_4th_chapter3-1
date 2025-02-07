import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { VStack, Heading, HStack, IconButton, Select } from '@chakra-ui/react';
import RenderMonthView from './RenderMonthView';
import RenderWeekView from './RenderWeekView';
import { Event } from '../types';

interface EventCalendarComponentProps {
  view: 'week' | 'month';
  setView: React.Dispatch<React.SetStateAction<'week' | 'month'>>;
  currentDate: Date;
  holidays: {
    [key: string]: string;
  };
  navigate: (direction: 'prev' | 'next') => void;
  filteredEvents: Event[];
  notifiedEvents: string[];
}

const EventCalendarComponent = ({
  view,
  setView,
  currentDate,
  holidays,
  navigate,
  filteredEvents,
  notifiedEvents,
}: EventCalendarComponentProps) => {
  return (
    <VStack flex={1} spacing={5} align="stretch">
      <Heading>일정 보기</Heading>

      <HStack mx="auto" justifyContent="space-between">
        <IconButton
          aria-label="Previous"
          icon={<ChevronLeftIcon />}
          onClick={() => navigate('prev')}
        />
        <Select
          aria-label="view"
          value={view}
          onChange={(e) => setView(e.target.value as 'week' | 'month')}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </Select>
        <IconButton
          aria-label="Next"
          icon={<ChevronRightIcon />}
          onClick={() => navigate('next')}
        />
      </HStack>

      {view === 'week' && (
        <RenderWeekView
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
      {view === 'month' && (
        <RenderMonthView
          currentDate={currentDate}
          holidays={holidays}
          filteredEvents={filteredEvents}
          notifiedEvents={notifiedEvents}
        />
      )}
    </VStack>
  );
};

export default EventCalendarComponent;
