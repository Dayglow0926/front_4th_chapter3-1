import { Event, EventForm } from '../types';

export const saveOrUpdateEvent = async (
  eventData: Event | EventForm,
  saveEvent: (eventData: Event | EventForm) => Promise<void>,
  resetForm: () => void
) => {
  await saveEvent(eventData);
  resetForm();
};
