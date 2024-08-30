import React from 'react';
import { Container, Header, Section, SectionTitle, FolderStructure, FileContent, Actions, Label } from './Status.styles';
import CopySections from '../../components/CopySections';
import { useStepState } from "../../stateManagement/zustand/selectors/createTest.selectors";
import { useError, useIsLoading } from "../../stateManagement/zustand/selectors/createTest.selectors";
import LoadingError from "./components/LoadingError";
import CreateTestSection from "./components/CreateTestSection";

const FolderContextManager: React.FC = () => {
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
