import Button from './Button';

const APIError = ({ 
  error, 
  onRetry,
  title = 'Something went wrong' 
}) => {
  const errorMessage = error?.response?.data?.msg || 
                       error?.response?.data?.message || 
                       error?.message || 
                       'An unexpected error occurred';

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-surface rounded-lg p-8 max-w-md text-center">
        <svg
          className="w-16 h-16 text-error mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-text-secondary mb-6">{errorMessage}</p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default APIError;
