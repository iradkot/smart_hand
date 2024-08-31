import React from 'react';
import { Container, Header, Section, FolderStructure, FileContent, Actions, Label } from './Status.styles';
import CopySections from '../../components/CopySections/CopySections';
import { useStepState } from "../../stateManagement/zustand/selectors/createTest.selectors";
import { useError, useIsLoading } from "../../stateManagement/zustand/selectors/createTest.selectors";
import LoadingError from "./components/LoadingError";
import CreateTestSection from "./components/CreateTestSection";
import { formatFileContents } from '../../../../utils/harvesterUtils';

const FolderContextManager: React.FC = () => {
  const stepState = useStepState();
  const isLoading = useIsLoading();
  const error = useError();
  const copiedContent = stepState?.copiedContent;
  const joinedContent = copiedContent?.contentTree
    ? formatFileContents(copiedContent.contentTree) // Accessing the root node
    : '';

  return (
    <Container>
      <Header>Managing Folder Context</Header>
      <Label>Step 3: Focusing on path {stepState?.directoryPath}</Label>
      <LoadingError isLoading={isLoading} error={error} />

      <Section>
        {copiedContent?.folderStructure && (
          <FolderStructure>
            <CopySections content={copiedContent.folderStructure} title={'Folder Structure'} />
          </FolderStructure>
        )}
      </Section>

      <Section>
        {joinedContent && (
          <FileContent>
            <CopySections content={joinedContent} title={'Files Content'} />
          </FileContent>
        )}
      </Section>

      <Actions>
        <CreateTestSection />
        {/* Future buttons or inputs can be added here */}
      </Actions>
    </Container>
  );
};

export default FolderContextManager;
