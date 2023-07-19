import { useCallback, useEffect, useState } from 'react';
import {
  PlusIcon,
  MinusIcon,
  Cross1Icon,
  OpacityIcon
} from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

import { InputDropdown } from '@/components/inputs/InputDropdown';
import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { CustomDatePicker } from '@/components/date-picker/CustomDatePicker';
import { useQueryParam } from '@/hooks/useQueryParams';
import { travelAPI } from '@/api/TravelAPI';

interface IDestinationInput {
  id: string;
  removable: boolean;
}

interface IDestinationInputProps {
  destination: IDestinationInput;
  handleRemoveDestination: (id: string) => void;
}

interface IDestinationsProps {
  destinations: Array<IDestinationInput>;
  onRemoveDestination: (id: string) => void;
}

const DestinationInput = ({
  destination,
  handleRemoveDestination
}: IDestinationInputProps) => {
  const [urlValue, setUrlValue] = useState<string>('');

  const isOrigin = destination.id === 'origin';
  const isLastDestination = destination.id === 'end';

  const {
    getQueryParam,
    removeQueryParam,
    updateQueryParam
  } = useQueryParam();

  useEffect(() => {
    const urlCitySelected = getQueryParam(destination.id);
    if (urlCitySelected) {
      setUrlValue(urlCitySelected);
    }
  }, [destination.id, getQueryParam]);

  const handleSearchCities = useCallback(
    async (value: string) => {
      try {
        const data = await travelAPI.getCitiesBySearchValue(
          value
        );
        return data;
      } catch (error) {
        console.error(error);
        throw new Error();
      }
    },
    []
  );

  const handleClearCity = () => {
    removeQueryParam(destination.id);
    return 'You must choose a city';
  };

  const handleSelectCity = (city: string) =>
    updateQueryParam(destination.id, city);

  return (
    <div className="relative flex h-[60px] items-start gap-8">
      {isLastDestination ? (
        <div className="relative top-[24px] flex w-[24px] scale-125 items-center justify-center">
          <OpacityIcon className="rotate-180 stroke-0 text-red" />
          <div className="absolute top-1.5 h-1 w-1 rounded-[50%] bg-red"></div>
        </div>
      ) : (
        <div className="relative top-[24px] flex w-[24px] flex-col items-center gap-[8px]">
          <div className="h-4 w-4 rounded-[50%] border border-black"></div>
          <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
          <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
          <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
          <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
          <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
          <div className="h-0.5 w-0.5 rounded-[50%] bg-black"></div>
        </div>
      )}
      <div className="flex flex-col items-start gap-1">
        <label>
          City of {isOrigin ? 'origin' : 'destination'}
        </label>
        <div className="flex items-center gap-4">
          <InputDropdown
            id={destination.id}
            initialValue={urlValue}
            onSearch={handleSearchCities}
            onSelect={handleSelectCity}
            onClear={handleClearCity}
          />
          {destination.removable ? (
            <div
              onClick={() =>
                handleRemoveDestination(destination.id)
              }
              className="flex h-4 w-4 -translate-y-[2px] cursor-pointer items-center justify-center rounded-[50%] border border-purple-dark transition-all duration-300 hover:scale-90"
            >
              <Cross1Icon className="h-2 w-2 stroke-purple-dark" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Destinations = ({
  destinations,
  onRemoveDestination
}: IDestinationsProps) => {
  return (
    <div className="flex flex-col gap-5">
      {destinations.map((destination) => {
        return (
          <DestinationInput
            key={destination.id}
            destination={destination}
            handleRemoveDestination={() =>
              onRemoveDestination(destination.id)
            }
          />
        );
      })}
    </div>
  );
};

const Passengers = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [minusDisabled, setMinusDisabled] =
    useState<boolean>(true);
  const { getQueryParam, updateQueryParam } =
    useQueryParam();

  useEffect(() => {
    const urlPassengers = getQueryParam('passengers');
    if (urlPassengers) {
      setQuantity(parseInt(urlPassengers));
      setMinusDisabled(parseInt(urlPassengers) === 1);
    }
  }, [getQueryParam]);

  const handleIncrement = () => {
    const updatedQunatity = quantity + 1;
    if (updatedQunatity > 1) {
      setMinusDisabled(false);
    }
    setQuantity(updatedQunatity);
    updateQueryParam(
      'passengers',
      updatedQunatity.toString()
    );
  };

  const handleDecrement = () => {
    const updatedQunatity = quantity - 1;
    if (quantity === 1) {
      setMinusDisabled(true);
      return;
    }
    setQuantity(updatedQunatity);
    updateQueryParam(
      'passengers',
      updatedQunatity.toString()
    );
  };

  return (
    <div className="flex h-[60px] w-[96px] flex-col items-start justify-start gap-1">
      <label>Passengers</label>
      <div className="border-gray flex h-[32px] w-full items-center justify-center gap-2 rounded-lg border px-3 py-2">
        <IconButton
          disabled={minusDisabled}
          onClick={handleDecrement}
        >
          <MinusIcon />
        </IconButton>
        <input
          type="number"
          className="appearence-none w-[16px] bg-transparent text-center focus-within:outline-none"
          value={quantity}
          onChange={(e) =>
            setQuantity(parseInt(e.target.value))
          }
        />
        <IconButton onClick={handleIncrement}>
          <PlusIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default function Home() {
  const [destinations, setDestinations] = useState([
    { id: 'origin', removable: false },
    { id: 'end', removable: false }
  ]);
  const [tripDate, setTripdate] = useState('');
  const [initialMount, setInitialMount] = useState(true);

  const {
    searchParams,
    getQueryParam,
    removeQueryParam,
    updateQueryParam
  } = useQueryParam();

  const addCurrentIntermediates = useCallback(
    (count: number) => {
      const currentIntermediates = [];
      for (let i = 1; i <= count; i++) {
        const existingIntermediate = {
          id: `intermediate-${i}`,
          removable: true
        };
        currentIntermediates.push(existingIntermediate);
      }
      const updatedDestinations = [
        destinations[0],
        ...currentIntermediates,
        ...destinations.slice(1)
      ];
      setDestinations(updatedDestinations);
    },
    [destinations]
  );

  useEffect(() => {
    if (searchParams.toString() && initialMount) {
      const intermediates =
        searchParams
          .toString()
          .match(new RegExp('intermediate', 'gi')) || [];
      addCurrentIntermediates(intermediates.length);
      setInitialMount(false);
    }
  }, [searchParams, initialMount, addCurrentIntermediates]);

  useEffect(() => {
    const queryDate = getQueryParam('date');
    if (queryDate) {
      setTripdate(queryDate);
    }
  }, [
    searchParams,
    initialMount,
    addCurrentIntermediates,
    getQueryParam
  ]);

  const handleAddDestination = () => {
    const destinationIndex = destinations.length - 1;
    const newDestination = {
      id: `intermediate-${destinationIndex}`,
      removable: true
    };
    const intermediateDestinations = destinations.filter(
      (destination) =>
        destination.id !== 'origin' &&
        destination.id !== 'end'
    );
    const updatedDestinations = [
      destinations[0],
      ...intermediateDestinations,
      newDestination,
      destinations[destinations.length - 1]
    ];
    setDestinations(updatedDestinations);
  };

  const handleRemoveDestination = (id: string) => {
    const order = id.split('-')[1];
    const updatedDestinations = destinations.filter(
      (destination) => destination.id !== id
    );
    const currentDestinationKey = id;
    const nextDestinationKey = `intermediate-${
      parseInt(order) + 1
    }`;
    const nextDestinationValue = searchParams.get(
      nextDestinationKey
    );
    if (nextDestinationValue) {
      updateQueryParam(
        currentDestinationKey,
        nextDestinationValue
      );
      removeQueryParam(nextDestinationKey);
    } else {
      removeQueryParam(id);
    }
    setDestinations(updatedDestinations);
  };

  const handleSelectDate = (date: Date | null) => {
    if (date !== null) {
      updateQueryParam('date', date.toString());
    } else {
      removeQueryParam('date');
    }
  };

  return (
    <div className="relative flex h-[450px] w-[734px] flex-col items-center justify-center gap-4 rounded-3xl border border-purple-light bg-blur px-[86px] py-[66px] shadow-purple-lg">
      <div className="flex w-full items-start justify-between">
        <div className="flex h-full flex-col gap-4 overflow-scroll">
          <Destinations
            destinations={destinations}
            onRemoveDestination={handleRemoveDestination}
          />
          <div
            onClick={handleAddDestination}
            className="group relative left-[48px] flex w-36 cursor-pointer items-center justify-between gap-1"
          >
            <div className=" flex h-4 w-4 items-center justify-center rounded-[50%] border border-purple-dark transition-all duration-300 group-hover:scale-110">
              <PlusIcon className="stroke-purple-dark" />
            </div>
            <span className="text-purple-dark">
              Add destination
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start gap-5">
          <Passengers />
          <CustomDatePicker
            initialDate={tripDate}
            onSelectDate={handleSelectDate}
          />
        </div>
      </div>
      <Link
        to={{
          pathname: '/mozio-challenge/results',
          search: searchParams.toString()
        }}
      >
        <Button label="Submit" />
      </Link>
    </div>
  );
}
