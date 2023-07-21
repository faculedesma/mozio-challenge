import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleDownIcon,
  TriangleUpIcon
} from '@radix-ui/react-icons';

import 'react-datepicker/dist/react-datepicker.css';
import { getMonth, getYear } from 'date-fns';
import { useController, Control } from 'react-hook-form';
import { Spinner } from '@/components/loaders/Spinner';
import { IDestinationsFormValues } from '@/types/form';

interface ICustomDatePickerProps {
  initialDate?: string;
  onSelectDate: (date: Date | null) => void;
  control: Control<IDestinationsFormValues>;
  error?: string;
}

interface ICustomHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const addYears = (date: Date, years: number) => {
  date.setFullYear(date.getFullYear() + years);
  return date;
};

const years = new Array(2)
  .fill(null)
  .map((_, i) => 2023 + i);

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];

const CustomContainer = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-[240px] items-center justify-center overflow-hidden rounded-[8px] border border-purple-light bg-white shadow-purple-light">
      <TriangleUpIcon className="absolute left-2 top-[1px] text-purple-light" />
      {children}
    </div>
  );
};

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled
}: ICustomHeaderProps) => {
  return (
    <div className="flex h-[22px] w-full items-center justify-evenly bg-transparent p-0">
      <button
        aria-label="Previous Month"
        className={
          'group flex h-[16px] w-[16px] items-center justify-center  rounded-[50%] border border-purple-dark bg-purple-dark transition-all duration-300 hover:bg-purple-light disabled:border-0 disabled:bg-gray-light group-hover:text-purple-dark'
        }
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
      >
        <ChevronLeftIcon className="text-white group-hover:text-purple-dark group-disabled:text-white" />
      </button>
      <div className="flex items-center gap-1">
        <div className="relative flex gap-1">
          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) => {
              changeMonth(months.indexOf(value));
            }}
            className="flex h-[22px] w-[54px] cursor-pointer appearance-none items-center justify-center gap-0 rounded border border-purple-light bg-purple-light px-1 pl-3 text-[14px] font-medium uppercase transition-all duration-300 hover:border-purple-dark focus-visible:border-purple-dark"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-1 top-1 text-purple-dark">
            <TriangleDownIcon />
          </div>
        </div>
        <div className="relative flex gap-1">
          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => {
              changeYear(parseInt(value));
            }}
            className="flex h-[22px] w-[54px] cursor-pointer appearance-none items-center justify-center gap-0 rounded border border-purple-light bg-purple-light px-1 text-[14px] font-medium uppercase transition-all duration-300 hover:border-purple-dark focus-visible:border-purple-dark"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-1 top-1 text-purple-dark">
            <TriangleDownIcon />
          </div>
        </div>
      </div>
      <button
        aria-label="Previous Month"
        className={
          'disabled:border-gray group flex h-[16px] w-[16px] items-center justify-center rounded-[50%] border border-purple-dark bg-purple-dark transition-all duration-300 hover:bg-purple-light disabled:bg-gray-light'
        }
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
      >
        <ChevronRightIcon className="stroke-2 text-white group-hover:text-purple-dark" />
      </button>
    </div>
  );
};

export const CustomDatePicker = ({
  onSelectDate,
  control,
  error
}: ICustomDatePickerProps) => {
  const { field } = useController({
    control,
    name: 'date',
    rules: { required: 'Select a date' }
  });
  const [startDate, setStartDate] = useState<Date | null>(
    null
  );

  useEffect(() => {
    if (field.value) {
      setStartDate(new Date(field.value));
    }
  }, [field.value]);

  const handleChangeDate = (date: Date | null) => {
    field.onChange(date?.toString());
    setStartDate(date);
    onSelectDate(date);
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <label>Date</label>
      {/* {!field.value ? (
        <> */}
      <DatePicker
        dateFormat="MM/dd/yyyy"
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        selected={startDate}
        onChange={(date) => handleChangeDate(date)}
        minDate={new Date()}
        maxDate={addYears(new Date(), 1)}
        calendarContainer={CustomContainer}
        renderCustomHeader={CustomHeader}
        fixedHeight
        className={`${error ? 'border border-red' : ''}`}
      />
      {error ? (
        <p className="text-red">Select a date</p>
      ) : null}
      {/* </>
      ) : (
        <Spinner />
      )} */}
    </div>
  );
};
