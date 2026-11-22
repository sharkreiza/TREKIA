import { render, screen } from '@testing-library/react';
import App from './App';

test('sin sesión muestra el inicio de sesión', async () => {
  localStorage.clear();
  sessionStorage.clear();
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
});
