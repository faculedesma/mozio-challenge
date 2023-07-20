import { Link } from 'react-router-dom';
import { Button } from '@/components/buttons/Button';
import { useQueryParam } from '@/hooks/useQueryParams';
import MozioErrorPNG from '@/assets/images/mozio-error.png';

interface IErrorProps {
  message?: string;
}

export default function Error({
  message = ''
}: IErrorProps) {
  const { searchParams } = useQueryParam();

  return (
    <div className="flex w-[380px] items-center justify-center gap-4 overflow-auto rounded-3xl border border-purple-light bg-blur px-[22px] py-[30px] shadow-purple-light md:w-[734px] md:flex-col md:py-[66px]">
      <div className="flex flex-col-reverse items-center justify-center gap-10 md:flex-row">
        <div className="flex flex-col items-start gap-10 md:w-[30%]">
          <p className="text-bold text-3xl md:w-[200px]">
            Oops! Something went wrong
          </p>
          <p className="text-bold">{message}</p>
          <div className="flex flex-col gap-4">
            <Link
              to={{
                pathname: '/home',
                search: searchParams.toString()
              }}
            >
              <Button label="Back" />
            </Link>
          </div>
        </div>
        <img src={MozioErrorPNG} alt="error-mozio" />
      </div>
    </div>
  );
}
