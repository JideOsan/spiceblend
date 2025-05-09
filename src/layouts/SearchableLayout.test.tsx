import { screen, fireEvent } from '@testing-library/react';
import SearchableLayout from './SearchableLayout';
import { renderWithProviders } from './../../vitest.setup';

describe('Feed With Search Layout', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('renders with initial value from sessionStorage', () => {
    sessionStorage.setItem('testKey', 'Initial Search');

    renderWithProviders(
      <SearchableLayout searchSessionKey="testKey">
        {({ searchString }) => <div>Search String: {searchString}</div>}
      </SearchableLayout>,
    );

    expect(screen.getByDisplayValue('Initial Search')).toBeInTheDocument();
    expect(
      screen.getByText('Search String: Initial Search'),
    ).toBeInTheDocument();
  });

  it('updates sessionStorage when typing in the input', () => {
    renderWithProviders(
      <SearchableLayout searchSessionKey="testKey">
        {({ searchString }) => <div>Search String: {searchString}</div>}
      </SearchableLayout>,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Search' } });

    expect(screen.getByDisplayValue('New Search')).toBeInTheDocument();
    expect(screen.getByText('Search String: New Search')).toBeInTheDocument();
    expect(sessionStorage.getItem('testKey')).toBe('New Search');
  });

  it('passes searchString prop to child function', () => {
    renderWithProviders(
      <SearchableLayout searchSessionKey="testKey">
        {({ searchString }) => <div>Search String: {searchString}</div>}
      </SearchableLayout>,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Search Test' } });

    expect(screen.getByText('Search String: Search Test')).toBeInTheDocument();
  });
});
