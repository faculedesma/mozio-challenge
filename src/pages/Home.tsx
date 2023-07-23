import { useCallback, useEffect, useState } from 'react';
import {
  PlusIcon,
  MinusIcon,
  Cross1Icon,
  OpacityIcon
} from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import {
  useForm,
  useController,
  Control,
  useFieldArray,
  FieldValues,
  Path
} from 'react-hook-form';

import { InputDropdown } from '@/components/inputs/InputDropdown';
import { Button } from '@/components/buttons/Button';
import { IconButton } from '@/components/buttons/IconButton';
import { CustomDatePicker } from '@/components/date-picker/CustomDatePicker';
import { useQueryParam } from '@/hooks/useQueryParams';
import { travelAPI } from '@/api/TravelAPI';
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

interface IPassengerProps<
  TFieldValues extends FieldValues
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
}

interface IDestinationInput {
  id: string;
  value: string;
}

interface IDestinationInputProps {
  handleRemoveDestination: (id: number) => void;
  index: number;
  total: number;
  control: Control<IDestinationsFormValues>;
}

interface IDestinationsProps {
  fields: IDestinationInput[];
  control: Control<IDestinationsFormValues>;
  onRemoveDestination: (id: number) => void;
}

const DestinationInput = ({
  index,
  total,
  control,
  handleRemoveDestination
}: IDestinationInputProps) => {
  const isOrigin = index === 0;
  const isLastDestination = index === total - 1;
  const isRemovable = !isOrigin && !isLastDestination;

  const { searchParams, updateQueryParam } =
    useQueryParam();

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

  const handleSelectCity = (city: string) => {
    let destinationQuery = '';
    const destinations =
      searchParams.get('destinations') || '';
    if (!destinations) {
      destinationQuery = city;
    } else {
      const updatedDestinations = destinations.split(',');
      if (updatedDestinations.length === total) {
        updatedDestinations[index] = city;
      } else {
        updatedDestinations.splice(index, 0, city);
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
          <InputDropdown<IDestinationsFormValues>
            name={`destinations.${index}.value`}
            control={control}
            onSearch={handleSearchCities}
            onSelect={handleSelectCity}
            customValidation={handleInputError}
          />
          <div
            onClick={() => handleRemoveDestination(index)}
            className={
              `flex h-4 w-4 -translate-y-[2px] cursor-pointer ${!isRemovable ? 'border-0': ''} items-center justify-center rounded-[50%] border border-purple-dark transition-all duration-300 hover:scale-90`
            }
          >
            <Cross1Icon
              className={`${
                !isRemovable
                  ? 'pointer-events-none hidden'
                  : ''
              } h-2 w-2 stroke-purple-dark`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Destinations = ({
  fields,
  control,
  onRemoveDestination
}: IDestinationsProps) => {
  return fields.length ? (
    <div className="flex flex-col gap-5">
      {fields.map((field, index) => {
        return (
          <DestinationInput
            key={field.id}
            index={index}
            total={fields.length}
            control={control}
            handleRemoveDestination={() =>
              onRemoveDestination(index)
            }
          />
        );
      })}
    </div>
  ) : (
    <div className="flex items-center justify-center md:justify-start md:gap-[24px]">
      <div className="md-w-[32px] h-[188px] w-[0] animate-pulse rounded bg-purple-light"></div>
      <div className="flex flex-col items-center justify-center gap-[20px] md:w-[324px]">
        <div className="flex h-[32px] w-[286px] animate-pulse rounded bg-purple-light md:w-[324px]"></div>
        <div className="flex h-[32px] w-[286px] animate-pulse rounded bg-purple-light md:w-[324px]"></div>
        <div className="flex h-[32px] w-[286px] animate-pulse rounded bg-purple-light md:w-[324px]"></div>
        <div className="flex h-[32px] w-[286px] animate-pulse rounded bg-purple-light md:w-[324px]"></div>
      </div>
    </div>
  );
};

const Passengers = <TFieldValues extends FieldValues>({
  control,
  name
}: IPassengerProps<TFieldValues>) => {
  const { field } = useController({
    control,
    name,
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
        {field.value ? (
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
    formState: { isValid }
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
      let parsedDate;
      const passengers = searchParams.get('passengers')
        ? parseInt(searchParams.get('passengers')!)
        : 1;
      const date = searchParams.get('date');
      if (date) {
        const splittedDate = date.split('-');
        console.log(splittedDate);
        parsedDate = new Date(
          parseInt(splittedDate[2]),
          parseInt(splittedDate[0]),
          parseInt(splittedDate[1])
        );
      } else {
        parsedDate = new Date();
      }
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
        date: parsedDate.toString(),
        destinations:
          currentDestinations || defaultDestinations
      };
    };

    if (!initialValues) {
      setTimeout(() => {
        const formValues = getDefaultFormValues();
        setInitialValues(formValues);
        reset(formValues);
      }, 300);
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
      const month =
        date.getMonth().toString().length === 1
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      const day =
        date.getDate().toString().length === 1
          ? `0${date.getDate()}`
          : date.getDate();
      updateQueryParam(
        'date',
        `${month}-${day}-${date.getFullYear()}`
      );
    } else {
      removeQueryParam('date');
    }
  };

  return (
    <div className="relative flex w-[380px] flex-col items-center gap-4 rounded-3xl border border-purple-light bg-blur px-[22px] py-[30px] shadow-purple-lg md:min-h-[373px] md:min-w-[734px] md:px-[86px] md:py-[66px]">
      <form
        id="destinations-form"
        onSubmit={handleSubmit(() => null)}
        className="flex w-full flex-col items-center justify-center gap-8"
      >
        <div className="flex w-full flex-col items-start justify-between gap-8 md:flex-row md:gap-0">
          <div className="flex max-h-full flex-col gap-4 self-center">
            <Destinations
              fields={fields}
              control={control}
              onRemoveDestination={handleRemoveDestination}
            />
            {initialValues ? (
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
            ) : null}
          </div>
          <div className="relative left-[10px] flex w-[236px] justify-between gap-5 self-center md:left-0 md:w-auto md:flex-col md:items-start md:self-start">
            <Passengers
              control={control}
              name="passengers"
            />
            {initialValues ? (
              <CustomDatePicker<IDestinationsFormValues>
                control={control}
                name="date"
                onSelectDate={handleSelectDate}
              />
            ) : (
              <div className="relative h-[32px] w-[96px] animate-pulse gap-5 rounded-md border bg-purple-light px-2"></div>
            )}
          </div>
        </div>
        {initialValues ? (
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
        ) : null}
      </form>
    </div>
  );
}
