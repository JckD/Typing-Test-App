import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import CreateQuote from '../components/CreateQuote.component';
import Card from "../components/Card";

test(' render component test', () => {
    const { getByPlaceholderText } = render(<CreateQuote />);
    const quoteTitleControl = getByPlaceholderText(/Quote Title/i);
    expect(quoteTitleControl).toBeInTheDocument();
})

