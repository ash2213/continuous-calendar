// components/DemoWrapper.test.jsx
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DemoWrapper from './DemoWrapper';
import { SnackProvider } from '../app/SnackProvider';

test('adds new event to debug list when created', async () => {
  // Wrapp DemoWrapper i SnackProvider
  render(
    <SnackProvider>
      <DemoWrapper />
    </SnackProvider>
  );

  const user = userEvent.setup();

  // Klik på "+ Add Event"-knappen
  await user.click(screen.getByRole('button', { name: /\+ add event/i }));

  // Find dialogen
  const dialog = screen.getByRole('dialog', { name: /create new event/i });

  // Udfyld titel
  const titleInput = within(dialog).getByLabelText(/title/i);
  await user.type(titleInput, 'My Test Event');

  // Udfyld evt. andre felter hvis nødvendigt
  // const dateInput = within(dialog).getByLabelText(/date/i);
  // await user.clear(dateInput);
  // await user.type(dateInput, '2025-11-03');

  // Klik på "Create Event"-knappen
  const createButton = within(dialog).getByRole('button', { name: /create event/i });
  await user.click(createButton);

  // Check at eventet vises i debug-listen
  const debugList = screen.getByTestId('debug-list'); // Husk at tilføje data-testid="debug-list" i DemoWrapper
  expect(within(debugList).getByText(/my test event/i)).toBeInTheDocument();
  expect(within(debugList).getByText(/recently created/i)).toBeInTheDocument();
});
