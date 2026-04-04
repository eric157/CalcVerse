import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex h-screen w-full flex-col items-center justify-center bg-[var(--bg-void)] p-8 text-center text-[var(--text-primary)]">
            <h2 className="text-2xl font-bold text-red-500">Something went wrong.</h2>
            <p className="mt-2 text-[var(--text-dim)]">
              The application encountered an unexpected error.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-[var(--accent-cyan)] px-4 py-2 font-semibold text-black transition hover:opacity-90"
            >
              Reload Page
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
