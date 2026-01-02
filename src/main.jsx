// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './pages/App.jsx';

import Projects from './pages/Projects.jsx';
import About from './pages/ContactPage.jsx';
import Certificates from './pages/Certificates.jsx';
import Tools from './pages/Tools.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
    {
    path: "/about",
    element: <About />,
  },
  {
    path: "/certificates",
    element: <Certificates />,
  },
    {
    path: "/tools",
    element: <Tools />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />

  </StrictMode>
);