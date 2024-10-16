import styled from 'styled-components';
import { Label as SharedLabel } from '../../style/styledComponents';

// Base styles
export const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.backgroundColor};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadow.default};
`;

export const Header = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textColor};
`;

export const Section = styled.div`
  margin-bottom: 30px;
`;

export const FolderStructure = styled.div`
  padding: 10px;
  background-color: ${({ theme }) => theme.shades.light};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  overflow-y: auto;
`;

export const FileContent = styled.pre`
  padding: 10px;
  background-color: ${({ theme }) => theme.shades.light};
  border-radius: ${({ theme }) => theme.borderRadius}px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  overflow-x: auto;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  button {
    flex: 1;
    min-width: 150px;
  }
`;

export const Label = styled(SharedLabel)`
  margin-bottom: 20px;
  font-size: 1rem;
  color: ${({ theme }) => theme.textColor};
`;
