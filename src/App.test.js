import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Navbar Link', () => {
  const { getByText, getAllByText } = render(<App />);
  const accountLinkElement = getByText(/Account/i);
  const quotesLinkElement = getByText(/Quotes/i);
  const createQuoteLinkElement = getByText(/Create Quote/i);

  expect(accountLinkElement).toBeInTheDocument();
  expect(quotesLinkElement).toBeInTheDocument();
  expect(createQuoteLinkElement).toBeInTheDocument();
 
});


