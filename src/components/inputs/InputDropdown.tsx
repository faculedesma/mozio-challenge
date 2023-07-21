import { useCallback, useEffect, useState } from 'react';
import {
  Cross1Icon,
  TriangleUpIcon
} from '@radix-ui/react-icons';
import * as Popover from '@radix-ui/react-popover';
import {
  useController,
  Control,
  FieldValues,
  Path
} from 'react-hook-form';

interface IInputDropdownProps<
  TFieldValues extends FieldValues
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  onSearch: (value: string) => Promise<string[]>;
  onSelect: (value: string) => void;
  onClear?: (value: string) => void;
  customValidation: (value: string) => string | boolean;
}

export const InputDropdown = <
  TFieldValues extends FieldValues
>({
  name,
  control,
  onSearch,
  onSelect,
  onClear,
  customValidation
}: IInputDropdownProps<TFieldValues>) => {
  const {
    field,
    fieldState: { error }
  } = useController({
    control,
    name,
    rules: {
      validate: (fieldValue) => customValidation(fieldValue)
    }
  });
  const [filteredItems, setFilteredItems] = useState<
    string[]
  >([]);
  const [empty, setEmpty] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] =
    useState<boolean>(false);

  const handleSearch = useCallback(async () => {
    try {
      const items = await onSearch(field.value);
      if (!items.length) {
        setEmpty(true);
        setIsLoading(false);
        return;
      }
      setFilteredItems(items);
      setIsLoading(false);
      setEmpty(false);
    } catch (e) {
      console.log(e);
    }
  }, [onSearch, field.value]);

  useEffect(() => {
    if (error) {
      setIsOpen(false);
    }
  }, [error]);

  useEffect(() => {
    if (field.value.length > 0 && !error) {
      const debounceTimer = setTimeout(async () => {
        await handleSearch();
      }, 500);
      return () => {
        clearTimeout(debounceTimer);
      };
    }
  }, [handleSearch, field.value, error]);

  const handleInputChange = (value: string) => {
    field.onChange(value);
    setIsLoading(true);
    setIsOpen(true);
    setEmpty(false);
  };

  const handleClearInput = () => {
    handleClose();
    onClear && onClear(field.value);
    setIsLoading(false);
    setEmpty(false);
    field.onChange('');
  };

  const handleSelectItem = (item: string) => {
    field.onChange(item);
    setIsLoading(false);
    setEmpty(false);
    onSelect(item);
    handleClose();
  };

  const handleClose = () => setIsOpen(false);

  const getDropdownContent = () => {
    if (isLoading) {
      return Array(5)
        .fill({})
        .map((_, index) => {
          return (
            <div
              key={index}
              className="mb-[4px] flex h-[28px] w-2/3 animate-pulse items-center justify-start rounded-md bg-gray-light"
            ></div>
          );
        });
    }

    if (empty && !error) {
      return (
        <p className="text-left">
          No results were found for <b>{field.value}</b>
        </p>
      );
    }

    return filteredItems?.map((item) => {
      return (
        <div
          key={item.toString()}
          onClick={() => handleSelectItem(item)}
          className="flex h-[28px] w-full cursor-pointer items-center justify-start rounded-md p-1 transition-all duration-300 hover:bg-purple-light focus-visible:bg-purple-light focus-visible:outline-none"
        >
          {item.toString()}
        </div>
      );
    });
  };

  const removeAutoFocusPopover = (event: Event) =>
    event.preventDefault();

  return (
    <div className="relative flex flex-col items-start justify-start gap-1">
      <Popover.Root open={isOpen}>
        <div className="relative flex h-[32px] w-[236px] md:w-[324px]">
          <input
            name={field.name}
            value={field.value}
            onChange={(e) =>
              handleInputChange(e.target.value)
            }
            autoComplete="off"
            className={`dbg-transparent w-full ${
              error ? 'text-red' : ''
            } & relative flex h-full items-center gap-5 border focus-visible:outline-none ${
              !error ? 'border-gray' : 'border-red'
            } rounded-md bg-transparent px-2`}
          />
          {!error && field.value ? (
            <Cross1Icon
              className="absolute right-3 top-3 cursor-pointer stroke-purple-dark transition-all duration-300 hover:scale-90"
              onClick={handleClearInput}
            />
          ) : null}
        </div>
        {error ? (
          <p className="text-red">{error.message}</p>
        ) : null}
        <Popover.Trigger></Popover.Trigger>
        <Popover.Content
          onOpenAutoFocus={removeAutoFocusPopover}
          onCloseAutoFocus={handleClose}
          onEscapeKeyDown={handleClose}
          onPointerDownOutside={handleClose}
          onInteractOutside={handleClose}
          className="absolute left-0 top-2 z-10 flex max-h-[180px] w-[236px] flex-col gap-1 rounded-lg border border-purple-light bg-white p-2 shadow-purple-light focus-visible:outline-none md:w-[324px]"
        >
          <TriangleUpIcon className="absolute -top-3 left-2 text-purple-dark" />
          <div className="h-full overflow-scroll">
            {getDropdownContent()}
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
};
