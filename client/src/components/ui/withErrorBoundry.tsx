import React from 'react';
import ErrorBoundary from './ErrorBoundary';

export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) => {
  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  // Set display name for better debugging
  const wrappedComponentName = WrappedComponent.displayName 
    || WrappedComponent.name 
    || 'Component';
    
  WithErrorBoundary.displayName = `withErrorBoundary(${wrappedComponentName})`;

  return WithErrorBoundary;
};

export default withErrorBoundary;