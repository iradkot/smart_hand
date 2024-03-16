import React, { useEffect } from 'react';
import { Checkmark, StyledLabel } from './ChooseOptions.styles';
import {optionsData} from "../OPTION_SHOW_REACT_NATIVE_LOGS";
import {useStepManager} from "../../contexts/StepManagerContext";
import {useNavigate} from "react-router-dom";

const ChooseOptions = () => {
  const { setStepState, stepState } = useStepManager(); // Example of using context for state
  return (
    <>
      {optionsData.map((opt, index) => (
        <StyledLabel key={opt.value}>
          <input
            autoFocus={index === 0}
            type="radio"
            value={opt.value}
            checked={stepState.option === opt.value}
            onChange={() => setStepState({...stepState, option: opt.value})}
          />
          <Checkmark />
          {opt.label}
        </StyledLabel>
      ))}
    </>
  );
};

export default ChooseOptions;
