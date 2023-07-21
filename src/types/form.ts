import { Field } from 'react-hook-form';

interface IDestinationsFormValues {
  passengers: number;
  date: string;
  destinations: Field[];
}

export type { IDestinationsFormValues };
