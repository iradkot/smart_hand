import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // Use NavLink
import { routesConfig } from './routeConfig';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledNav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${props => props.theme.backgroundColor};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px ${props => props.theme.shadowColor};
`;

const StyledUl = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  gap: 2rem;
`;

const StyledLi = styled.li`
  margin: 0;
`;

const AnimatedNavLink = styled(animated(NavLink))`
  color: ${props => props.theme.textColor};
  text-decoration: none;
  &.active {
    font-weight: bold; // Highlight active link
    color: ${props => props.theme.accentColor};
  }
  &:hover {
    color: ${props => props.theme.accentColor};
  }
`;

const AnimatedButton = styled(animated.button)`
  background-color: ${props => props.theme.buttonBackgroundColor};
  color: ${props => props.theme.buttonTextColor};
  padding: 10px 20px;
  border: none;
  border-radius: ${props => props.theme.borderRadius}px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.accentColor};
    transform: scale(1.05);
  }
  transition: background-color 0.3s, transform 0.2s ease-in-out;
`;

const MainMenu = () => {
  const navigate = useNavigate();

  const linkAnimation = useSpring({
    from: { transform: 'scale(1)', opacity: 0.8 },
    to: { transform: 'scale(1.1)', opacity: 1 },
    reset: true,
    reverse: true,
    delay: 200,
  });

  const buttonAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 100,
  });

  return (
    <Container>
      <StyledNav>
        <StyledUl>
          {routesConfig.map((route, index) => (
            <StyledLi key={index}>
              <AnimatedNavLink to={route.path} style={linkAnimation} className={({ isActive }) => (isActive ? 'active' : '')}>
                {route.label}
              </AnimatedNavLink>
            </StyledLi>
          ))}
        </StyledUl>
        <div>
          <AnimatedButton style={buttonAnimation} onClick={() => navigate(-1)}>Back</AnimatedButton>
          <AnimatedButton style={buttonAnimation} onClick={() => navigate('/')}>Home</AnimatedButton>
        </div>
      </StyledNav>
      <Outlet />
    </Container>
  );
};

export default MainMenu;
