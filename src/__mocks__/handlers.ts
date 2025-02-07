import { http, HttpResponse } from 'msw';

import { Event } from '../types';
import { events } from './response/events.json' assert { type: 'json' };

// ! HARD
// ! 각 응답에 대한 MSW 핸들러를 작성해주세요. GET 요청은 이미 작성되어 있는 events json을 활용해주세요.
export const handlers = [
  http.get('/api/events', () => HttpResponse.json({ events })),

  http.post('/api/events', async ({ request }) => {
    const event = (await request.json()) as Event;
    event.id = String(events.length + 1);
    events.push(event);
    return new HttpResponse();
  }),

  http.put('/api/events/:id', async ({ params, request }) => {
    const eventId = params.id as string;
    const updateEventData = (await request.json()) as Event;

    const index = events.findIndex((event) => event.id === eventId);

    if (index !== -1) {
      events[index] = { ...events[index], ...updateEventData };
    } else {
      return HttpResponse.error();
    }

    return new HttpResponse();
  }),

  http.delete('/api/events/:id', ({ params }) => {
    const eventId = params.id;
    const index = events.findIndex((event) => event.id === eventId);

    if (index !== -1) {
      events.splice(index, 1);
    } else {
      return HttpResponse.error();
    }

    return new HttpResponse();
  }),
];
