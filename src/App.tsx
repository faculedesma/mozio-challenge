import { MozioLogo } from './assets/svgs/MozioLogo';

import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import Home from '@/pages/Home';
import Results from '@/pages/Results';

const router = createBrowserRouter([
  {
    path: '/mozio-challenge',
    element: <Navigate to="/mozio-challenge/home" replace />
  },
  {
    path: '/mozio-challenge/home',
    element: <Home />
  },
  {
    path: '/mozio-challenge/results',
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
