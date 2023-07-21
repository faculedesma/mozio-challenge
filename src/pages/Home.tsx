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
import {
  useForm,
  useController,
  Control,
  useFieldArray,
  FieldErrors
} from 'react-hook-form';
import { Spinner } from '@/components/loaders/Spinner';
import { IDestinationsFormValues } from '@/types/form';

const defaultDestinations = [
  {
    value: ''
  },
  {
    value: ''
  }
];

interface IDestinationInput {
  id: string;
  value: string;
}

interface IDestinationInputProps {
  destination: IDestinationInput;
  handleRemoveDestination: (id: number) => void;
  index: number;
  total: number;
  control: Control<IDestinationsFormValues>;
  error: string | undefined;
}

interface IDestinationsProps {
  destinations: IDestinationInput[];
  control: Control<IDestinationsFormValues>;
  onRemoveDestination: (id: number) => void;
  errors: FieldErrors<IDestinationsFormValues>;
}

const DestinationInput = ({
  destination,
  handleRemoveDestination,
  index,
  total,
  control,
  error
}: IDestinationInputProps) => {
  const isOrigin = index === 0;
  const isLastDestination = index === total - 1;
  const isRemovable = !isOrigin && !isLastDestination;

  const {
    searchParams,
    updateQueryParam,
    removeQueryParam
  } = useQueryParam();

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

  const handleClearCity = (city: string) => {
    const destinations = searchParams.get('destinations')!;
    const updatedDestinations = destinations.split(',');
    if (!updatedDestinations) {
      removeQueryParam('destinations');
    } else {
      const indexToRemove =
        updatedDestinations.indexOf(city);
      if (indexToRemove !== -1) {
        updatedDestinations.splice(index, 1);
      }
      updateQueryParam(
        'destinations',
        updatedDestinations.filter((d) => d !== city).join()
      );
    }
    return 'You must choose a city';
  };

  const handleSelectCity = (city: string) => {
    let destinationQuery = '';
    const destinations =
      searchParams.get('destinations') || '';
    if (!destinations) {
      destinationQuery = city;
    } else {
      const updatedDestinations = destinations.split(',');
      if (updatedDestinations.length < 2) {
        updatedDestinations.push(city);
      } else {
        const indexToInsert =
          updatedDestinations.length - 1;
        updatedDestinations.splice(indexToInsert, 0, city);
      }
      destinationQuery = updatedDestinations.join();
    }
    updateQueryParam('destinations', destinationQuery);
  };

  const handleInputError = (value: string) => {
    if (value.length === 0) {
      return 'You must choose a city';
    }
    if (value.toLowerCase() === 'fail') {
      return 'Oops! Failed to search with this keyword.';
    }
    return true;
  };

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
            index={index}
            onSearch={handleSearchCities}
            onSelect={handleSelectCity}
            onClear={handleClearCity}
            control={control}
            customValidation={handleInputError}
            error={error}
          />
          {isRemovable ? (
            <div
              onClick={() => handleRemoveDestination(index)}
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
  control,
  onRemoveDestination,
  errors
}: IDestinationsProps) => {
  console.log(errors);
  return (
    <div className="flex flex-col gap-5">
      {destinations.map((destination, index) => {
        return (
          <DestinationInput
            key={destination.id}
            destination={destination}
            index={index}
            total={destinations.length}
            control={control}
            handleRemoveDestination={() =>
              onRemoveDestination(index)
            }
            error={
              errors?.destinations?.[index]?.value?.message
            }
          />
        );
      })}
    </div>
  );
};

const Passengers = ({
  control
}: {
  control: Control<IDestinationsFormValues>;
}) => {
  const { field } = useController({
    control,
    name: 'passengers',
    rules: { required: true }
  });

  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (field.value) {
      setQuantity(field.value);
    }
  }, [field.value]);

  const { updateQueryParam } = useQueryParam();

  const handleIncrement = () => {
    const updatedQunatity = quantity + 1;
    field.onChange(updatedQunatity);
    setQuantity(updatedQunatity);
    updateQueryParam(
      'passengers',
      updatedQunatity.toString()
    );
  };

  const handleDecrement = () => {
    const updatedQunatity = quantity - 1;
    field.onChange(updatedQunatity);
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
          disabled={quantity === 1}
          onClick={handleDecrement}
        >
          <MinusIcon />
        </IconButton>
        {quantity ? (
          <input
            type="number"
            className="appearence-none w-[16px] bg-transparent text-center focus-within:outline-none"
            ref={field.ref}
            value={quantity}
            onChange={(e) => {
              field.onChange(e.target.value);
              setQuantity(parseInt(e.target.value));
            }}
          />
        ) : (
          <Spinner />
        )}
        <IconButton onClick={handleIncrement}>
          <PlusIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default function Home() {
  const [initialValues, setInitialValues] =
    useState<IDestinationsFormValues>();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid }
  } = useForm<IDestinationsFormValues>({
    defaultValues: initialValues,
    mode: 'onChange'
  });

  const { fields, insert, remove } = useFieldArray({
    control,
    name: 'destinations'
  });

  const {
    searchParams,
    removeQueryParam,
    updateQueryParam
  } = useQueryParam();

  useEffect(() => {
    const getDefaultFormValues = () => {
      let currentDestinations;
      const passengers = searchParams.get('passengers')
        ? parseInt(searchParams.get('passengers')!)
        : 1;
      const date = searchParams.get('date') || new Date();
      const destinations = searchParams
        .get('destinations')
        ?.split(',');
      if (destinations) {
        if (destinations.length > 1) {
          currentDestinations = destinations.map(
            (destination) => ({ value: destination })
          );
        } else {
          currentDestinations = [
            { value: destinations[0] },
            { value: '' }
          ];
        }
      }
      return {
        passengers,
        date: date.toString(),
        destinations:
          currentDestinations || defaultDestinations
      };
    };

    if (!initialValues) {
      const formValues = getDefaultFormValues();
      setInitialValues(formValues);
      reset(formValues);
    }
  }, [reset, searchParams, initialValues]);

  const handleAddDestination = () => {
    insert(fields.length - 1, { value: '' });
  };

  const handleRemoveDestination = (index: number) => {
    remove(index);
    const destinations =
      searchParams.get('destinations') || '';
    const updatedDestinations = destinations
      .split(',')
      .filter((_, i) => i !== index);
    updateQueryParam(
      'destinations',
      updatedDestinations.join()
    );
  };

  const handleSelectDate = (date: Date | null) => {
    if (date !== null) {
      updateQueryParam('date', date.toString());
    } else {
      removeQueryParam('date');
    }
  };

  return (
    <div className="relative flex w-[380px] flex-col items-center gap-4 rounded-3xl border border-purple-light bg-blur px-[22px] py-[30px] shadow-purple-lg md:w-[734px] md:px-[86px] md:py-[66px]">
      <form
        id="destinations-form"
        onSubmit={handleSubmit(() => null)}
        className="flex w-full flex-col items-center justify-center gap-8"
      >
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:gap-0">
          <div className="flex max-h-full flex-col gap-4 self-center">
            <Destinations
              destinations={fields}
              control={control}
              onRemoveDestination={handleRemoveDestination}
              errors={errors}
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
          <div className="relative left-[10px] flex w-[236px] justify-between gap-5 self-center md:left-0 md:w-auto md:flex-col md:items-start md:self-start">
            <Passengers control={control} />
            <CustomDatePicker
              control={control}
              onSelectDate={handleSelectDate}
              error={errors.date?.message}
            />
          </div>
        </div>
        <Link
          to={{
            pathname: '/results',
            search: searchParams.toString()
          }}
        >
          <Button
            label="Submit"
            type="submit"
            form="destinations-form"
            disabled={!isValid}
          />
        </Link>
      </form>
    </div>
  );
}
