import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../stateManagement/zustand/useStore';

export const useAppNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setCurrentRoute = useStore((state) => state.setCurrentRoute);
  const rehydrated = useStore((state) => state.rehydrated);

  useEffect(() => {
    if (rehydrated && location.pathname !== '/') {
      setCurrentRoute(location.pathname);
    }
  }, [location.pathname, setCurrentRoute, rehydrated]);

  const navigateTo = (
    to: string | number,
    options?: { replace?: boolean; state?: any }
  ) => {
    if (typeof to === 'number') {
      navigate(to);
    } else {
      navigate(to, options);
      setCurrentRoute(to);
    }
  };

  return navigateTo;
};
