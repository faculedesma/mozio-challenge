import { MozioLogo } from './assets/svgs/MozioLogo';

import {
  createHashRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import Home from '@/pages/Home';
import Results from '@/pages/Results';

const router = createHashRouter([
  {
    path: '/',
    element: <Navigate to="/home" />
  },
  {
    path: '/mozio-challenge',
    element: <Navigate to="/home" />
  },
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/results',
    element: <Results />
  }
]);

const App = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <MozioLogo />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
