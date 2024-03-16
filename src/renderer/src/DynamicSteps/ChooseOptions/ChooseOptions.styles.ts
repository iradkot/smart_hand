import styled from 'styled-components';

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  cursor: pointer;
  padding-left: 25px;
  position: relative;

  &:hover input ~ span {
    background-color: #ccc;
  }
  & input:checked ~ span {
    background-color: #2196F3;
  }
  & input:checked ~ span:after {
    display: block;
  }
`;

export const Checkmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border-radius: 50%;
  &:after {
    content: "";
    position: absolute;
    display: none;
    top: 6px;
    left: 6px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
  }
`;
