import React, { useState, useEffect } from 'react';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { fetchFolderStructure } from './api'; // Assume this is an API call to your backend

const TreeViewWithCheckboxes = () => {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    fetchFolderStructure().then(setNodes); // Fetch the initial tree structure
  }, []);

  const handleCheck = checked => setChecked(checked);
  const handleExpand = expanded => setExpanded(expanded);

  return (
    <CheckboxTree
      nodes={nodes}
      checked={checked}
      expanded={expanded}
      onCheck={handleCheck}
      onExpand={handleExpand}
      iconsClass="fa5"
    />
  );
};

export default TreeViewWithCheckboxes;
