import { Event, EventForm } from '../types';
import { findOverlappingEvents } from './eventOverlap';

export const checkOverlappingEvents = (
  eventData: Event | EventForm,
  events: Event[],
  setOverlappingEvents: (events: Event[]) => void,
  setIsOverlapDialogOpen: (isOpen: boolean) => void
) => {
  const overlapping = findOverlappingEvents(eventData, events);

  if (overlapping.length > 0) {
    setOverlappingEvents(overlapping);
    setIsOverlapDialogOpen(true);
    return false;
  }

  return true;
};
