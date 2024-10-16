import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CopySections from '../../../components/CopySections/CopySections';

interface ContentTabsProps {
  displayContent: string;
  displayStructure: string;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
                                                   displayContent,
                                                   displayStructure,
                                                 }) => {
  const [value, setValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleTabChange} centered>
        <Tab label="Folder Structure" />
        <Tab label="Code Content" />
        <Tab label="Both" />
      </Tabs>
      <Box mt={2}>
        {value === 0 && displayStructure && (
          <CopySections
            content={displayStructure}
            title="Selected Folder Structure"
            language="text"
          />
        )}
        {value === 1 && displayContent && (
          <CopySections
            content={displayContent}
            title="Selected Files Content"
            language="typescript"
          />
        )}
        {value === 2 && (
          <>
            {displayStructure && (
              <CopySections
                content={displayStructure}
                title="Selected Folder Structure"
                language="text"
              />
            )}
            {displayContent && (
              <CopySections
                content={displayContent}
                title="Selected Files Content"
                language="typescript"
              />
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ContentTabs;
