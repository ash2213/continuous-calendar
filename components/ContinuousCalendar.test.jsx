import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContinuousCalendar } from './ContinuousCalendar';// Sørg for default export i ContinuousCalendar.jsx

test('shows validation error when creating event without title', async () => {
  const mockOnCreate = jest.fn();

  // Render komponenten
  render(<ContinuousCalendar onCreate={mockOnCreate} />);

  // Klik på "+ Add Event"-knappen
  await userEvent.click(screen.getByRole('button', { name: /\+ add event/i }));

  // Vent på, at dialogen dukker op
  const dialog = await screen.findByRole('dialog');

  // Klik på "Create Event"-knappen inden i dialogen
  const createButton = within(dialog).getByRole('button', { name: /create event/i });
  await userEvent.click(createButton);

  // Forvent at fejlmeddelelsen vises
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();

  // Optional: Sørg for, at mockOnCreate ikke blev kaldt
  expect(mockOnCreate).not.toHaveBeenCalled();
});
