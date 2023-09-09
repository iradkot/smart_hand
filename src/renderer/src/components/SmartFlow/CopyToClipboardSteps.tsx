import React, {useState} from 'react';
import { Container } from './CopyToClipboardSteps.styles';
import StepManager from './StepManager';
import {StepState} from "./types";

function CopyToClipboardSteps() {
  return (
    <Container>
      <StepManager />
    </Container>
  );
}

export default CopyToClipboardSteps;
