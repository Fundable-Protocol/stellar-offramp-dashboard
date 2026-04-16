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
        <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-fundable-light-grey max-w-md">
              {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 text-xs font-medium text-fundable-purple-2 hover:text-white transition-colors bg-white/[0.04] px-4 py-2 rounded-lg border border-white/[0.06] hover:border-white/[0.12]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
