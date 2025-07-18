// Chatbotcomponenets/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Something went wrong. Please try again later.</p>
          {process.env.NODE_ENV === "development" && <p>Error: {this.state.error?.message}</p>}
        </div>
      );
    }
    return this.props.children;
  }
}