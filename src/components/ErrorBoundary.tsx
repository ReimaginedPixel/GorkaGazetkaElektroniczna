import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Co pokazać zamiast zepsutego fragmentu. Domyślnie nic (cichy fallback). */
  fallback?: ReactNode;
  /** Etykieta do logu (np. nazwa kafla). */
  label?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Global error boundary — błąd jednego kafla/widoku nie wywala całego ekranu.
 * Otaczamy nim kafle feedu oraz główny widok.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[ErrorBoundary${this.props.label ? ` ${this.props.label}` : ''}]`, error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
