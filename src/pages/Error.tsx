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
    <div className="flex w-[734px] flex-col items-center justify-center gap-4 overflow-auto rounded-3xl border border-purple-light bg-blur py-[66px] shadow-purple-light">
      <div className="flex items-center justify-center">
        <div className="flex w-[30%] flex-col items-start gap-10">
          <p className="text-bold w-[200px] text-3xl">
            Oops! Something went wrong
          </p>
          <p className="text-bold">{message}</p>
          <div className="flex flex-col gap-4">
            <Link
              to={{
                pathname: '/mozio-challenge/home',
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
