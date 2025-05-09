import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './main.css';
import SidebarLayout from './layouts/SidebarLayout.tsx';
import Blends from './pages/blends/index.tsx';
import Spices from './pages/spices/index.tsx';
import SpiceDetail from './pages/spice-detail/index.tsx';
import BlendDetail from './pages/blend-detail/index.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');

  return worker.start();
}

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    {
      element: <SidebarLayout />,
      children: [
        {
          path: '/',
          element: <Spices />,
          errorElement: <Spices />,
        },
        {
          path: '/spices',
          element: <Spices />,
          errorElement: <Spices />,
        },
        {
          path: '/blends',
          element: <Blends />,
          errorElement: <Blends />,
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
