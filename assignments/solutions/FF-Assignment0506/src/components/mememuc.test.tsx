import React from 'react';
import OMMMeme from './mememuc';
import { render, fireEvent } from '@testing-library/react';


it('renders without crashing', async () => {
    const { getBy } = render(<OMMMeme />);
    const text = document.querySelector('');
    expect(text!.innerHTML).toBe('0');
  });
  