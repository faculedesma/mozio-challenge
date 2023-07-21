import { ButtonHTMLAttributes } from 'react';

interface IIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export const IconButton = ({
  children,
  disabled = false,
  onClick = () => null,
  ...restProps
}: IIconButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border-gray flex h-[22px] w-[22px] items-center justify-center rounded bg-purple-light  px-2 py-3 text-white transition-all duration-300 hover:bg-purple-dark disabled:bg-gray-dark`}
      {...restProps}
    >
      {children}
    </button>
  );
};
