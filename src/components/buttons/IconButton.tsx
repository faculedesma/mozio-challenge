import { ButtonHTMLAttributes } from 'react';

interface IIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const IconButton = ({
  children,
  disabled = false,
  label = 'default',
  onClick = () => null,
  ...restProps
}: IIconButtonProps) => {
  return (
    <button
      id={`icon-${label}}`}
      onClick={onClick}
      disabled={disabled}
      className={`border-gray flex h-[22px] w-[22px] items-center justify-center rounded bg-purple-light  px-2 py-3 text-white transition-all duration-300 hover:bg-purple-dark disabled:bg-gray-dark`}
      aria-label={`aria-${label}`}
      {...restProps}
    >
      {children}
    </button>
  );
};
