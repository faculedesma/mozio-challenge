import { ButtonHTMLAttributes } from 'react';

interface IButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({
  label = 'Button',
  disabled = false,
  onClick = () => null,
  ...restProps
}: IButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-[38px] w-[335px] items-center justify-center rounded bg-purple-dark  px-[12px] py-[8px] text-white transition-all duration-300 hover:bg-purple-darker disabled:bg-gray-light md:w-auto"
      {...restProps}
    >
      {label}
    </button>
  );
};
