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
    console.error("Anatomica component error", error, info);
    window.dispatchEvent(
      new CustomEvent("anatomica:error", {
        detail: {
          name: error.name,
          message: error.message?.slice(0, 300),
          componentStack: info.componentStack?.slice(0, 500),
          path: window.location.pathname,
        },
      }),
    );
  }
  render() {
    if (this.state.failed)
      return (
        <div className="viewer-error-boundary" role="alert" style={{ padding: 24, textAlign: "center" }}>
          <strong>{this.props.title}</strong>
          <p>{this.props.message}</p>
          <p dir="rtl">تعذر تحميل هذا الجزء. يمكنك إعادة المحاولة أو العودة للصفحة الرئيسية.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => this.setState({ failed: false })}>
              {this.props.retryLabel}
            </button>
            <button type="button" onClick={() => window.location.reload()}>
              Reload page / إعادة تحميل
            </button>
            <button type="button" onClick={() => { window.location.href = "/"; }}>
              Home / الرئيسية
            </button>
          </div>
        </div>
      );
    return this.props.children;
  }
}
