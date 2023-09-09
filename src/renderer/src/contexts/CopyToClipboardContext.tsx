// renderer/src/contexts/CopyToClipboardContext.tsx

import React, {createContext, useContext, useEffect, useState} from 'react'
import {useCopyHistory} from './CopyHistoryContext'
import {StepState} from '../components/SmartFlow/types'
import {firstStep, StatusStep} from "../components/SmartFlow/constants";

interface ContextProps {
  directoryPath: string
  option: string
  setOption: React.Dispatch<React.SetStateAction<string>>
  message: string
  copiedContent: string
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  resetProcess: () => void
}

const CopyToClipboardContext = createContext<ContextProps | undefined>(undefined)

export const CopyToClipboardProvider: React.FC = ({children}) => {
  const {addToHistory} = useCopyHistory()
  const [currentStepId, setCurrentStepId] = useState(firstStep)
  const [stepState, setStepState] = useState<StepState>({})
  const [gptResponse, setGptResponse] = useState<string>('')
  const [step, setStep] = useState<number>(1)
  const [option, setOption] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [copiedContent, setCopiedContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (copiedContent) {
      addToHistory(stepState.directoryPath, copiedContent)
    }
  }, [copiedContent])

  useEffect(() => {
    console.log({currentStepId})
    if (currentStepId === StatusStep) {
      window.electron.ipcRenderer
        .invoke('invoke-copying-process', stepState.directoryPath, stepState.option)
        .then(({message, content}) => {
          setMessage(message)
          setCopiedContent(content)
        })
        .catch((err) => setMessage(`Error: ${err.message}`))
    }
  }, [currentStepId, stepState.directoryPath, stepState.option])

  const resetProcess = () => {
    setStepState({
      ...stepState,
      directoryPath: '',
      option: '',
      message: '',
      copiedContent: '',
    })
    setCurrentStepId(firstStep)
  }

  return (
    <CopyToClipboardContext.Provider
      value={{
        option,
        setOption,
        message,
        copiedContent,
        step,
        setStep,
        resetProcess,
        gptResponse,
        setGptResponse,
        setCopiedContent,
        currentStepId,
        setCurrentStepId,
        stepState,
        setStepState,
      }}
    >
      {children}
    </CopyToClipboardContext.Provider>
  )
}

export const useCopyToClipboard = () => {
  const context = useContext(CopyToClipboardContext)
  if (!context) {
    throw new Error('useCopyToClipboard must be used within a CopyToClipboardProvider')
  }
  return context
}
