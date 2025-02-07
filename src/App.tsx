import { EventCalendarProvider } from './components/EventCalendarProvider.tsx';
import { EventFormProvider } from './components/EventFormProvider.tsx';
import EventCalendarPage from './pages/EventCalendarPage.tsx';

function App() {
  return (
    <EventFormProvider>
      <EventCalendarProvider>
        <EventCalendarPage />
      </EventCalendarProvider>
    </EventFormProvider>
  );
}

export default App;
