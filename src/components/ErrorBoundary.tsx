import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="surface flex flex-col items-center justify-center gap-4 rounded-xl p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-rose-300/20 bg-rose-400/[0.08]">
            <AlertTriangle className="h-6 w-6 text-rose-200" aria-hidden="true" />
          </div>
          <div>
            <h3 className="mb-1 text-base font-semibold text-white">
              Something went wrong
            </h3>
            <p className="max-w-md text-sm text-fundable-light-grey">
              {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-medium text-fundable-light-grey transition-colors hover:border-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
