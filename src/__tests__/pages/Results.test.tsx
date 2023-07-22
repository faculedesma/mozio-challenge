import Results from '@/pages/Results';
import {
  render,
  screen,
  waitFor
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';

jest.mock('@/api/TravelAPI', () => ({
  travelAPI: {
    getDistanceBetweenCities: jest.fn().mockResolvedValue([
      {
        cityOne: 'Paris',
        cityTwo: 'Toulouse',
        distance: 588.14
      },
      {
        cityOne: 'Toulouse',
        cityTwo: 'Montpellier',
        distance: 195.84
      }
    ])
  }
}));

jest.useFakeTimers();

describe('Results Component', () => {
  it('should render loading page', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '?destinations=Paris%2CToulouse%2CMontpellier&passengers=2&date=date=07-22-2023'
        ]}
      >
        <Results />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('loading-pulse')
    ).toBeInTheDocument();
  });

  it('should render error if dijon is present', () => {
    render(
      <MemoryRouter
        initialEntries={[
          '?destinations=Paris%2CDijon%2CMontpellier&passengers=2&date=date=07-22-2023'
        ]}
      >
        <Results />
      </MemoryRouter>
    );

    jest.runAllTimers();

    expect(
      screen.getByText('Oops! Something went wrong')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /back/i })
    ).toBeInTheDocument();
  });

  it('should render travel information if no error', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '?destinations=Paris%2CToulouse%2CMontpellier&passengers=2&date=07-22-2023'
        ]}
      >
        <Results />
      </MemoryRouter>
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(
        screen.getByText('Toulouse')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Montpellier')
      ).toBeInTheDocument();
      expect(
        screen.getByText('783.98 km')
      ).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(
        screen.getByText('Jul 22, 2023')
      ).toBeInTheDocument();
      screen.getByRole('button', { name: /Back/i });
    });
  });
});
