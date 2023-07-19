interface IButtonProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button = ({
  label = 'Button',
  disabled = false,
  onClick = () => null
}: IButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-[38px] items-center justify-center rounded bg-purple-dark  px-[12px] py-[8px] text-white transition-all duration-300 hover:bg-purple-darker disabled:bg-gray-light"
    >
      {label}
    </button>
  );
};
