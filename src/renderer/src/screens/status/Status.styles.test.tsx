import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Container, Header, Section, FolderStructure, FileContent, Actions, Label } from './Status.styles';

const mockTheme = {
  backgroundColor: '#fff',
  borderRadius: 5,
  shadow: { default: '0 2px 5px rgba(0,0,0,0.15)' },
  textColor: '#000',
  shades: { light: '#f0f0f0' },
  borderColor: '#ccc',
};

describe('Status.styles', () => {
  test('Container renders correctly with theme', () => {
    const { container } = render(<ThemeProvider theme={mockTheme}><Container>Content</Container></ThemeProvider>);
    expect(container.firstChild).toHaveStyle(`padding: 20px`);
    expect(container.firstChild).toHaveStyle(`background-color: ${mockTheme.backgroundColor}`);
  });

  test('Header renders correctly with theme', () => {
    const { getByText } = render(<ThemeProvider theme={mockTheme}><Header>Header</Header></ThemeProvider>);
    expect(getByText('Header')).toHaveStyle(`font-size: 1.5rem`);
    expect(getByText('Header')).toHaveStyle(`color: ${mockTheme.textColor}`);
  });

  test('Section renders correctly', () => {
    const { container } = render(<ThemeProvider theme={mockTheme}><Section>Section</Section></ThemeProvider>);
    expect(container.firstChild).toHaveStyle(`margin-bottom: 30px`);
  });

  test('FolderStructure renders correctly with theme', () => {
    const { container } = render(<ThemeProvider theme={mockTheme}><FolderStructure>Folders</FolderStructure></ThemeProvider>);
    expect(container.firstChild).toHaveStyle(`padding: 10px`);
    expect(container.firstChild).toHaveStyle(`background-color: ${mockTheme.shades.light}`);
  });

  test('FileContent renders correctly with theme', () => {
    const { container } = render(<ThemeProvider theme={mockTheme}><FileContent>File content</FileContent></ThemeProvider>);
    expect(container.firstChild).toHaveStyle(`padding: 10px`);
    expect(container.firstChild).toHaveStyle(`background-color: ${mockTheme.shades.light}`);
  });

  test('Actions renders buttons with correct styles', () => {
    const { container } = render(<ThemeProvider theme={mockTheme}><Actions><button>Action 1</button></Actions></ThemeProvider>);
    expect(container.firstChild).toHaveStyle(`display: flex`);
  });

  test('Label renders correctly with theme', () => {
    const { getByText } = render(<ThemeProvider theme={mockTheme}><Label>Label</Label></ThemeProvider>);
    expect(getByText('Label')).toHaveStyle(`margin-bottom: 20px`);
    expect(getByText('Label')).toHaveStyle(`color: ${mockTheme.textColor}`);
  });
});
