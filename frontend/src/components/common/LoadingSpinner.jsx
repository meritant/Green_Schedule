function LoadingSpinner() {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }
  
  export default LoadingSpinner;