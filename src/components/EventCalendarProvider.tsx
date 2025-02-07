import React, { createContext, useContext } from 'react';

import { useCalendarView } from '../hooks/useCalendarView';

const EventCalendarContext = createContext<ReturnType<typeof useCalendarView>>(
  {} as ReturnType<typeof useCalendarView>
);

interface EventCalendarProviderProps {
  children: React.ReactNode;
}

export const EventCalendarProvider = ({ children }: EventCalendarProviderProps) => {
  const eventCalendar = useCalendarView();
  return (
    <EventCalendarContext.Provider value={eventCalendar}>{children}</EventCalendarContext.Provider>
  );
};

export const useEventCalendarContext = () => {
  const context = useContext(EventCalendarContext);
  if (!context) {
    throw new Error('useEventCalendarContext must be used within an EventCalendarProvider');
  }
  return context;
};
