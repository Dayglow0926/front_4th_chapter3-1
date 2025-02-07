import { createContext, useContext } from 'react';
import { useEventForm } from '../hooks/useEventForm';

const EventFormContext = createContext<ReturnType<typeof useEventForm>>(
  {} as ReturnType<typeof useEventForm>
);

export const EventFormProvider = ({ children }) => {
  const eventForm = useEventForm();

  return <EventFormContext.Provider value={eventForm}>{children}</EventFormContext.Provider>;
};

export const useEventFormContext = () => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error('useEventFormContext must be used within an EventFormProvider');
  }
  return context;
};
