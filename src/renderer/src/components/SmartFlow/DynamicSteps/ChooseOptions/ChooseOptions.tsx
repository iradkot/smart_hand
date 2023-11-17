import React, { FC, useEffect } from "react";
import { StepState } from '../../types'
import { optionsData } from '../optionsData'
import { Checkmark, StyledLabel } from "./ChooseOptions.styles";

interface ChooseOptionsProps {
  stepState: StepState
  setStepState: React.Dispatch<React.SetStateAction<StepState>>
}

const ChooseOptions: FC<ChooseOptionsProps> = ({ stepState, setStepState }) => {

  useEffect(() => {
    if (!stepState.option && optionsData.length > 0) {
      setStepState({ ...stepState, option: optionsData[0].value });
    }
  }, [stepState, setStepState]);

  return (
    <>
      {optionsData.map((opt, index) => (
        <StyledLabel key={opt.value}>
          <input
            autoFocus={index === 0}
            type="radio"
            value={opt.value}
            checked={stepState.option === opt.value}
            onChange={(e) => setStepState({ ...stepState, option: e.target.value })}
          />
          <Checkmark />
          {opt.label}
        </StyledLabel>
      ))}
    </>
  );
}

export default ChooseOptions;
