// src/types/FileSelector.types.ts

import { ContentNode } from '../../../types/pathHarvester.types';

export interface BaseFolderFileSelectorProps {
  contentTree: ContentNode;
  allowMultiple?: boolean;
  initialSelected?: string[];
  allowFolderSelection?: boolean;
}

export interface ControlledFolderFileSelectorProps extends BaseFolderFileSelectorProps {
  selected: string[];
  setSelected: (files: string[]) => void;
  persistSelectedState?: false;
}

export interface PersistedFolderFileSelectorProps extends BaseFolderFileSelectorProps {
  persistSelectedState: true;
}

export type FolderFileSelectorProps =
  | ControlledFolderFileSelectorProps
  | PersistedFolderFileSelectorProps;
