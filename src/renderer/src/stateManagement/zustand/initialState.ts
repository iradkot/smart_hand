// src/stateManagement/zustand/initialState.ts

import { OptionValue, StepState } from '../../types/types';
import { ContentTree, copiedContent, ContentNode } from '../../../../types/pathHarvester.types';

export const initialContentNode: ContentNode = {
  type: 'directory',
  localPath: '',
  children: {} as ContentTree,
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
