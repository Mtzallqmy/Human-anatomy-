"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class AppErrorBoundary extends Component<
  { children: ReactNode; title: string; message: string; retryLabel: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    window.dispatchEvent(
      new CustomEvent("anatomica:error", {
        detail: { name: error.name, componentStack: info.componentStack?.slice(0, 500) },
      }),
    );
  }
  render() {
    if (this.state.failed)
      return (
        <div className="viewer-error-boundary" role="alert">
          <strong>{this.props.title}</strong>
          <p>{this.props.message}</p>
          <button type="button" onClick={() => this.setState({ failed: false })}>
            {this.props.retryLabel}
          </button>
        </div>
      );
    return this.props.children;
  }
}
