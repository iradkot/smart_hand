// screens/Status.tsx
import React from 'react';
import {Label} from '../../../../components/ui/styledComponents';
import CopySections from '../../components/CopySections';
import {useStepState} from "../../stateManagement/zustand/selectors/createTest.selectors";
import {useError, useIsLoading} from "../../stateManagement/zustand/selectors/createTest.selectors";
import LoadingError from "./components/LoadingError";
import CreateTestSection from "./components/CreateTestSection";

const Status: React.FC = () => {
  const stepState = useStepState();
  const isLoading = useIsLoading();
  const error = useError();
  const copiedContent = stepState?.copiedContent;

  const joinedContent = Array.isArray(copiedContent?.fileContents)
    ? copiedContent.fileContents
      .filter(item => item.isFile && item.content)
      .map(item => item.content)
      .join('\n')
    : '';

  return (
    <>
      <Label>Step 3: Status</Label>
      <LoadingError isLoading={isLoading} error={error}/>
      {copiedContent?.folderStructure && (
        <CopySections content={copiedContent.folderStructure} title={'Folder Structure'}/>
      )}
      {joinedContent && (
        <CopySections content={joinedContent} title={'Files Content'}/>
      )}
      <CreateTestSection/>
    </>
  );
};

export default Status;
