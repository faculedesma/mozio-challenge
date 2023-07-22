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
        cityTwo: 'Aix-en-Provence',
        distance: 638.3
      },
      {
        cityOne: 'Aix-en-Provence',
        cityTwo: 'Montpellier',
        distance: 126.86
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
          '?destinations=Paris%2CAix-en-Provence%2CMontpellier&passengers=2&date=date=07-22-2023'
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
          '?destinations=Paris%2CAix-en-Provence%2CMontpellier&passengers=2&date=07-22-2023'
        ]}
      >
        <Results />
      </MemoryRouter>
    );

    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByText('Paris')).toBeInTheDocument();
      expect(
        screen.getByText('Aix-en-Provence')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Montpellier')
      ).toBeInTheDocument();
      expect(
        screen.getByText('765.16 km')
      ).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(
        screen.getByText('Jul 22, 2023')
      ).toBeInTheDocument();
      screen.getByRole('button', { name: /Back/i });
    });
  });
});
