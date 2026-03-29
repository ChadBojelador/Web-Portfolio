import React from 'react';
import '../Styles/error-boundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <RouteErrorFallback />;
    }

    return this.props.children;
  }
}

export function RouteErrorFallback() {
  return (
    <div className="error-boundary" role="alert" aria-live="assertive">
      <div className="error-boundary__panel">
        <p className="error-boundary__eyebrow">Something went wrong</p>
        <h1 className="error-boundary__title">System Error</h1>
        <p className="error-boundary__message">
          Unexpected issues have occurred while rendering the page. We apologize for the inconvenience.
          Please try refreshing the page to continue.
        </p>
        <button
          className="error-boundary__action"
          onClick={() => window.location.reload()}
          aria-label="Refresh page"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
