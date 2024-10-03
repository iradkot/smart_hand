import React from 'react';
import { Container, Header, Section, FolderStructure, FileContent, Actions, Label } from './Status.styles';
import CopySections from '../../components/CopySections/CopySections';
import { useStore } from "../../stateManagement/zustand/useStore";
import LoadingError from "./components/LoadingError";
import CreateTestSection from "./components/CreateTestSection";
import { formatFileContents } from '../../../../utils/harvesterUtils/harvesterUtils';

const FolderContextManager: React.FC = () => {
  const stepState = useStore((state) => state.stepState);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const copiedContent = stepState?.copiedContent;
  const joinedContent = copiedContent?.contentTree
    ? formatFileContents(copiedContent.contentTree)
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
