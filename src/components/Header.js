import React from 'react';
import { useNavigation } from './NavigationContext';

const Header = () => {
  const { navigationState } = useNavigation();

  return (
    <header>
      <h1>{navigationState.title}</h1>
    </header>
  );
};

export default Header;
