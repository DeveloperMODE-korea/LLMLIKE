import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Global Error Boundary component for graceful error handling
 * Displays fallback UI when React component errors occur
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to external service in production
    if (import.meta.env.PROD) {
      // TODO: Send error to logging service
      // logErrorToService(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-red-500/30 rounded-2xl shadow-2xl max-w-lg w-full p-8">
            
            {/* Error Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                앗! 문제가 발생했습니다
              </h1>
              <p className="text-gray-300">
                예상치 못한 오류가 발생했습니다. 불편을 드려 죄송합니다.
              </p>
            </div>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-red-500/20">
                <h3 className="text-red-400 font-semibold mb-2">개발 모드 - 오류 정보:</h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <div>
                    <strong>오류:</strong> {this.state.error.message}
                  </div>
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>컴포넌트 스택:</strong>
                      <pre className="text-xs mt-1 overflow-x-auto whitespace-pre-wrap bg-slate-800 p-2 rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                다시 시도
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center border border-slate-600"
              >
                <Home className="w-4 h-4 mr-2" />
                홈으로
              </button>
            </div>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                문제가 계속 발생하면{' '}
                <a 
                  href="mailto:support@llmlike.com" 
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  고객지원
                </a>
                에 문의해 주세요.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback component for smaller sections
 */
export const SimpleErrorFallback: React.FC<{ 
  error?: Error; 
  resetErrorBoundary?: () => void;
  message?: string; 
}> = ({ 
  error, 
  resetErrorBoundary, 
  message = '이 섹션을 로드하는 중 오류가 발생했습니다.' 
}) => (
  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
    <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
    <p className="text-red-300 text-sm mb-3">{message}</p>
    {resetErrorBoundary && (
      <button
        onClick={resetErrorBoundary}
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
      >
        다시 시도
      </button>
    )}
    {import.meta.env.DEV && error && (
      <details className="mt-3 text-left">
        <summary className="text-xs text-red-400 cursor-pointer">오류 상세</summary>
        <pre className="text-xs text-gray-400 mt-1 overflow-x-auto bg-slate-900/50 p-2 rounded">
          {error.message}
        </pre>
      </details>
    )}
  </div>
);

export default ErrorBoundary; 