import { ContentNode } from 'src/types/pathHarvester.types';

type SelectionState = 'checked' | 'indeterminate' | 'unchecked';

export function getNodeSelectionState(
  node: ContentNode,
  effectiveSelected: string[],
  allowFolderSelection: boolean
): SelectionState {
  if (node.type === 'file') {
    return effectiveSelected.includes(node.localPath) ? 'checked' : 'unchecked';
  } else if (node.type === 'directory') {
    if (allowFolderSelection && effectiveSelected.includes(node.localPath)) {
      return 'checked';
    }
    if (node.children) {
      const childStates = Object.values(node.children).map((child) =>
        getNodeSelectionState(child, effectiveSelected, allowFolderSelection)
      );
      const allChecked = childStates.every((state) => state === 'checked');
      const allUnchecked = childStates.every((state) => state === 'unchecked');
      if (allChecked) return 'checked';
      if (allUnchecked) return 'unchecked';
      return 'indeterminate';
    }
  }
  return 'unchecked';
}

export function handleCheckChange(
  node: ContentNode,
  checked: boolean,
  effectiveSelected: string[],
  effectiveSetSelected: (files: string[]) => void,
  allowMultiple: boolean,
  allowFolderSelection: boolean
) {
  let newSelectedSet = allowMultiple ? new Set(effectiveSelected) : new Set<string>();

  if (!allowMultiple && checked) {
    // In single-select mode, only one item can be selected
    newSelectedSet.clear();
  }

  const updateSelection = (
    node: ContentNode,
    checked: boolean,
    selectedSet: Set<string>
  ) => {
    if (node.type === 'file' || (allowFolderSelection && node.type === 'directory')) {
      if (checked) {
        selectedSet.add(node.localPath);
      } else {
        selectedSet.delete(node.localPath);
      }
    }

    if (allowMultiple && node.children) {
      Object.values(node.children).forEach((child) =>
        updateSelection(child, checked, selectedSet)
      );
    }
  };

  updateSelection(node, checked, newSelectedSet);
  effectiveSetSelected(Array.from(newSelectedSet));
}
