import React, {useState} from 'react';
import { Container } from './CopyToClipboardSteps.styles';
import StepManager from './StepManager';
import {StepState} from "./types";

function MainMenu() {
  return (
    <Container>
      <StepManager />
    </Container>
  );
}

export default MainMenu;
