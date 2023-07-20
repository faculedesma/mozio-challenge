import {
  useEffect,
  useState,
  useCallback,
  useMemo
} from 'react';
import {
  OpacityIcon,
  SliderIcon,
  SewingPinFilledIcon
} from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { Button } from '@/components/buttons/Button';
import GoogleMapsPNG from '@/assets/images/google-maps.png';
import { useQueryParam } from '@/hooks/useQueryParams';
import { ICityDistance } from '@/types/city';
import { travelAPI } from '@/api/TravelAPI';
import ErrorPage from '@/pages/Error';

interface IResultsRoadStopProps {
  cityOne: string;
  cityTwo: string;
  kilometers: number;
  isEnd: boolean;
}

interface IResultTotalProps {
  distances: ICityDistance[];
  passengers: string | null;
  date: string | null;
}

interface IResultRoadProps {
  distances: ICityDistance[];
}

const Loading = () => {
  return (
    <div className="flex flex-col gap-10 md:flex-row">
      <div className="h-[200px] w-[300px] animate-pulse rounded-lg border border-purple-light bg-purple-light md:h-[300px]"></div>
      <div className="flex flex-col gap-4">
        <div className="h-[100px] w-[300px] animate-pulse rounded-md bg-purple-light md:h-[150px]"></div>
        <div className="h-[50px] w-[300px] animate-pulse rounded-md bg-purple-light md:h-[88px]"></div>
        <div className="h-[50px] w-[300px] animate-pulse rounded-md bg-purple-light md:h-[38px]"></div>
      </div>
    </div>
  );
};

const ResultsRoadStop = ({
  cityOne,
  cityTwo,
  kilometers,
  isEnd
}: IResultsRoadStopProps) => {
  return (
    <div className="flex flex-col">
      {isEnd ? (
        <div className="flex w-full min-w-[226px] flex-col gap-2">
          <div className="flex items-center gap-2 self-end">
            <div className="h-4 w-4 rounded-[50%] border border-black"></div>
            <span className="min-w-[96px]">{cityOne}</span>
          </div>
          <div className="flex items-center justify-center gap-3 self-start">
            <div className="relative flex h-[24px] w-[96px] items-center justify-center self-end rounded-md border border-purple-dark">
              <span className="text-[14px] text-purple-dark">
                {kilometers.toFixed(2)} km
              </span>
              <SliderIcon className="absolute -right-[16px] text-purple-light" />
            </div>
            <div className="flex w-[24px] flex-col items-center gap-[8px]">
              <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
              <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
              <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end">
            <div className="flex w-[14px] scale-125 items-start justify-center">
              <OpacityIcon className="rotate-180 stroke-0 text-red" />
              <div className="absolute top-1.5 h-1 w-1 rounded-[50%] bg-red"></div>
            </div>
            <span className="min-w-[96px]">{cityTwo}</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full min-w-[226px] flex-col gap-2">
          <div className="flex items-center gap-2 self-end">
            <div className="h-4 w-4 rounded-[50%] border border-black"></div>
            <span className="min-w-[96px]">{cityOne}</span>
          </div>
          <div className="flex items-center justify-center gap-3 self-start">
            <div className="relative flex h-[24px] w-[96px] items-center justify-center self-end rounded-md border border-purple-dark">
              <span className="text-[14px] text-purple-dark">
                {kilometers.toFixed(2)} km
              </span>
              <SliderIcon className="absolute -right-[16px] text-purple-light" />
            </div>
            <div className="flex w-[24px] flex-col items-center gap-2">
              <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
              <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
              <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultTotal = ({
  distances,
  passengers,
  date
}: IResultTotalProps) => {
  const totalDistance = useMemo(() => {
    return distances.reduce((acc, current) => {
      return (acc = acc + current.distance);
    }, 0);
  }, [distances]);

  const travelDate = date ? new Date(date) : new Date();
  const formattedDate = travelDate.toLocaleDateString(
    'default',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="font-bold text-purple-dark">
          {totalDistance.toFixed(2)} km
        </span>
        <span>is total distance</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-purple-dark">
          {passengers || 1}
        </span>
        <span>passengers</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-purple-dark">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

const ResultsRoad = ({ distances }: IResultRoadProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {distances.map((distance, index) => {
        return (
          <ResultsRoadStop
            cityOne={distance.cityOne}
            cityTwo={distance.cityTwo}
            kilometers={distance.distance}
            isEnd={index === distances.length - 1}
          />
        );
      })}
    </div>
  );
};

const ResultsMap = () => {
  return (
    <div className="relative h-[300px] w-[300px] overflow-hidden rounded-lg border border-purple-light shadow-purple-light">
      <img src={GoogleMapsPNG} alt="map-png" />
      <SewingPinFilledIcon className="absolute left-[68px] top-[18px] scale-[2] cursor-pointer stroke-purple-dark text-purple-light transition-all duration-300 hover:scale-[3]" />
      <SewingPinFilledIcon className="absolute bottom-[35px] right-[168px] scale-[2] cursor-pointer stroke-purple-dark text-purple-light transition-all duration-300 hover:scale-[3]" />
      <SewingPinFilledIcon className="absolute bottom-[127px] right-[139px] scale-[2] cursor-pointer stroke-purple-dark text-purple-light transition-all duration-300 hover:scale-[3]" />
    </div>
  );
};

export default function Results() {
  const [distances, setDistances] = useState<
    ICityDistance[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { searchParams } = useQueryParam();

  const getCitiesFromParams = (): string[] => {
    const origin = searchParams.get('origin')!;
    const end = searchParams.get('end')!;
    const intermediates = [];
    const intermediatesCount = (
      searchParams
        .toString()
        .match(new RegExp('intermediate', 'gi')) || []
    ).length;
    for (let i = 1; i <= intermediatesCount; i++) {
      intermediates.push(
        searchParams.get(`intermediate-${i}`)!
      );
    }
    return [origin, ...intermediates, end];
  };

  const cities = getCitiesFromParams();
  const passengers = searchParams.get('passengers');
  const travelDate = searchParams.get('date');

  const calculateDistances = useCallback(async () => {
    try {
      const data = await travelAPI.getDistanceBetweenCities(
        cities
      );
      setDistances(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }, [cities]);

  useEffect(() => {
    setTimeout(async () => {
      await calculateDistances();
    }, 2500);
  }, [calculateDistances]);

  if (cities.includes('Dijon')) {
    return (
      <ErrorPage message="We have encountered an error. Please try again. If the problem persists please contact use at +1 (855) 980 5669." />
    );
  }

  return (
    <div className="flex w-[380px] flex-col items-center justify-end gap-4 rounded-3xl border border-purple-light bg-blur px-[22px] py-[30px] shadow-purple-light md:w-[734px] md:py-[66px]">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center gap-12 md:flex-row">
          <ResultsMap />
          <div className="flex flex-col items-center justify-center gap-8">
            <ResultsRoad distances={distances} />
            <ResultTotal
              distances={distances}
              passengers={passengers}
              date={travelDate}
            />
            <Link
              to={{
                pathname: '/home',
                search: searchParams.toString()
              }}
            >
              <Button label="Back" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
