import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './main.css';
import SidebarLayout from './layouts/SidebarLayout.tsx';
import Home from './app/home/index.tsx';
import SpiceDetail from './app/spice-detail/index.tsx';
import BlendDetail from './app/blend-detail/index.tsx';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');

  return worker.start();
}

const router = createBrowserRouter(
  [
    {
      element: <SidebarLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
          errorElement: <Home />,
        },
        {
          path: '/spices/:id',
          element: <SpiceDetail />,
        },
        {
          path: '/blends/:id',
          element: <BlendDetail />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </StrictMode>,
  );
});
