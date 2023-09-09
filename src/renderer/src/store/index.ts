import create from 'zustand'

type State = {
  directoryPath: string
  option: string
  step: string
  message: string
  copiedContent: string
  setOption: (option: string) => void
  setStep: (step: string) => void
  setMessage: (message: string) => void
  setCopiedContent: (content: string) => void
}

const useStore = create<State>((set) => ({
  directoryPath: '',
  option: '',
  step: 'DirectoryPathInput',
  message: '',
  copiedContent: '',
  setOption: (option) => set({ option }),
  setStep: (step) => set({ step }),
  setMessage: (message) => set({ message }),
  setCopiedContent: (content) => set({ copiedContent: content }),
}))

export default useStore
