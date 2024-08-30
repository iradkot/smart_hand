import styled from 'styled-components';

const SectionContainer = styled.div`
  margin-bottom: 15px;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius}px;
  box-shadow: ${(props) => props.theme.shadow.default};
  background-color: ${(props) => props.theme.shades.light};
`;

export default SectionContainer;
