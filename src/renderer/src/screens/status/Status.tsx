import React, {useEffect} from 'react';
import {Container, Header, Section, FolderStructure, FileContent, Actions, Label} from './Status.styles';
import CopySections from '../../components/CopySections/CopySections';
import {useStore} from "../../stateManagement/zustand/useStore";
import LoadingError from "./components/LoadingError";
import CreateTestSection from "./components/CreateTestSection";
import {
  formatFileContents,
  generateSelectedFileContents,
  generateSelectedFolderStructure
} from '../../../../utils/harvesterUtils/harvesterUtils';
import ContentTreeFileSelector from "../../components/FileSelector";
import {Button} from "@mui/material";
import useLocalStorage from "../../hooks/useLocalStorage";
import {useCopyHistory} from "../../stateManagement/contexts";

const FolderContextManager: React.FC = () => {
  const {copyToClipboardWithToast} = useCopyHistory();
  const stepState = useStore((state) => state.stepState);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const copiedContent = stepState?.copiedContent;
  const joinedContent = copiedContent?.contentTree
    ? formatFileContents(copiedContent.contentTree)
    : '';
  const [selectedPaths, setSelectedPaths] = useLocalStorage<string[]>(
    'selectedPaths',
    []
  );
  const [displayContent, setDisplayContent] = useLocalStorage<string>('displayContent', '');
  const [displayStructure, setDisplayStructure] = useLocalStorage<string>('displayStructure', '');

  const handleCopyStructure = () => {
    copyToClipboardWithToast(displayStructure, 99);
  };

  const handleCopyContent = () => {
    copyToClipboardWithToast(displayContent, 99);
  };

  const handleCopyBoth = () => {
    const combinedContent = `${displayStructure}\n\n${displayContent}`;
    copyToClipboardWithToast(combinedContent, 99);
  };


  useEffect(() => {
    if (selectedPaths.length > 0 && copiedContent.contentTree) {
      const structure = generateSelectedFolderStructure(
        copiedContent.contentTree,
        selectedPaths
      );
      const contents = generateSelectedFileContents(
        copiedContent.contentTree,
        selectedPaths
      );
      setDisplayStructure(structure);
      setDisplayContent(contents);
    } else {
      setDisplayStructure('');
      setDisplayContent('');
    }
  }, [selectedPaths, copiedContent.contentTree]);


  return (
    <Container>
      <Header>Managing Folder Context</Header>
      <Label>Step 3: Focusing on path {stepState?.directoryPath}</Label>
      <LoadingError isLoading={isLoading} error={error}/>
      {copiedContent?.contentTree && (
        <>
          <Section>
            <ContentTreeFileSelector
              contentTree={copiedContent.contentTree}
              selected={selectedPaths}
              setSelected={setSelectedPaths}
              allowMultiple={true}
              allowFolderSelection={true}
            />
          </Section>
          <Actions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyStructure}
            >
              Copy Structure
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyContent}
            >
              Copy Content
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCopyBoth}
            >
              Copy Both
            </Button>
          </Actions></>
      )}

      <Section>
        {displayStructure && (
          <FolderStructure>
            <CopySections
              content={displayStructure}
              title={'Selected Folder Structure'}
            />
          </FolderStructure>
        )}
      </Section>

      <Section>
        {displayContent && (
          <FileContent>
            <CopySections
              content={displayContent}
              title={'Selected Files Content'}
            />
          </FileContent>
        )}
      </Section>

      <Section>
        {copiedContent?.folderStructure && (
          <FolderStructure>
            <CopySections content={copiedContent.folderStructure} title={'Full Folder Structure'}/>
          </FolderStructure>
        )}
      </Section>

      <Section>
        {joinedContent && (
          <FileContent>
            <CopySections content={joinedContent} title={'Entire Files Content'}/>
          </FileContent>
        )}
      </Section>

      <Actions>
        <CreateTestSection/>
        {/* Future buttons or inputs can be added here */}
      </Actions>
    </Container>
  );
};

export default FolderContextManager;
