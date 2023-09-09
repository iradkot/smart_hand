import React, {FC} from 'react'
import {Options} from '../CopyToClipboardSteps.styles'
import {Label} from '../../../style/styledComponents'
import {StepState} from '../types'

interface OptionData {
  value: string
  label: string
}

const optionsData: OptionData[] = [
  {value: '1', label: 'Copy file contents along with structure'},
  {value: '2', label: 'Only copy the file and folder structure'},
  {value: '3', label: 'Consult GPT for code review or questions'},
]

interface ChooseOptionsProps {
  state: StepState
  setState: React.Dispatch<React.SetStateAction<StepState>>
}

const ChooseOptions: FC<ChooseOptionsProps> = ({state, setState}) => {

  console.log('State in Status:', state)

  return (
    <>
      <Label>Step 2: Choose Option</Label>
      <Options>
        {optionsData.map((opt, index) => (
          <label key={index}>
            <input
              type="radio"
              value={opt.value}
              checked={state.option === opt.value}
              onChange={(e) => setState({...state, option: e.target.value})}
            />
            {opt.label}
          </label>
        ))}
      </Options>
    </>
  )
}

export default ChooseOptions
