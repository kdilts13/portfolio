import { render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/react';
import Home from '../src/app/page';

jest.mock('@/lib/api', () => ({
  apiFetch: jest.fn(() =>
    Promise.resolve({
      text: () => Promise.resolve('mock hello'),
      json: () => Promise.resolve({}),
    }),
  ),
}));

describe('Home page', () => {
  it('renders the Portfolio heading', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /portfolio/i })).toBeInTheDocument();
    });
  });
});
