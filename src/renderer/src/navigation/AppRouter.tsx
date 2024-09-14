import { Routes, Route, BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { routesConfig } from './routeConfig';
import MainMenu from './MainMenu';
import { useEffect } from 'react';
import { useStore } from '../stateManagement/zustand/useStore';
import { ToastContainer } from "react-toastify";

const AppRouterInner = ({ currentRoute }: { currentRoute: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(currentRoute, { replace: true });
    }
  }, [location, currentRoute, navigate]);

  return (
    <Routes>
      <Route path="/" element={<MainMenu />}>
        {/* Map other routes */}
        {routesConfig.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Route>
      <Route path="*" element={<p>404: Page not found</p>} />
    </Routes>
  );
};

const AppRouter = () => {
  const rehydrated = useStore((state) => state.rehydrated);
  const currentRoute = useStore((state) => state.currentRoute);
  return (
    <BrowserRouter>
      {rehydrated && currentRoute ? (
        <AppRouterInner currentRoute={currentRoute} />
      ) : (
        <p>Loading...</p> // Show loading until rehydration completes
      )}
      <ToastContainer />
    </BrowserRouter>
  );
};

export default AppRouter;
