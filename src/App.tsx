import { EventFormProvider } from './components/EventFormProvider.tsx';
import EventCalendarPage from './pages/EventCalendarPage.tsx';

function App() {
  return (
    <EventFormProvider>
      <EventCalendarPage />
    </EventFormProvider>
  );
}

export default App;
