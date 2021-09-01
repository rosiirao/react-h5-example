import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import api from './api';

jest.mock('./api');

test('renders learn react link', () => {
  const {getByText} = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('mock api mounted', () => {
  expect(api()).toBe('mounted');
});
