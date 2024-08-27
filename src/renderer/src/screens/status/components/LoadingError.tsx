interface LoadingErrorProps {
  isLoading: boolean;
  error: string | null;
}

const LoadingError: React.FC<LoadingErrorProps> = ({ isLoading, error }) => (
  <>
    {isLoading && <p>Loading...</p>}
    {error && <p>Error: {error}</p>}
  </>
);

export default LoadingError;
