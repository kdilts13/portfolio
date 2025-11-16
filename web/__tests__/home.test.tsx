import { render, screen } from '@testing-library/react';
import Home from '../src/app/page';

describe('Home page', () => {
  it('renders the Portfolio heading', async () => {
    render(<Home />);

    expect(screen.getByRole('heading', { name: /portfolio/i })).toBeInTheDocument();
  });
});
