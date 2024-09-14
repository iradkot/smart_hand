// src/stateManagement/zustand/initialState.ts

import { OptionValue, StepState } from '../../types';
import { contentTree, copiedContent, ContentNode } from '../../../../types/pathHarvester.types';

export const initialContentNode: ContentNode = {
  type: 'directory',
  localPath: '',
  children: {} as contentTree,
};

export const initialCopiedContent: copiedContent = {
  folderStructure: '',
  ignoredFiles: '',
  contentTree: initialContentNode,
};

export const initialStepState: StepState = {
  directoryPath: '',
  option: '' as OptionValue,
  message: '',
  copiedContent: initialCopiedContent,
};
