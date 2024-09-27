import styled from 'styled-components'

const Loader = ({ size = 50, color = '#000000' }: { size?: number; color?: string }) => {
  return (
    <LoaderContainer size={size}>
      <LoaderSpinner color={color} />
    </LoaderContainer>
  )
}

const LoaderContainer = styled.div<{ size: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
`

const LoaderSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: ${({ color }) => color};
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default Loader
