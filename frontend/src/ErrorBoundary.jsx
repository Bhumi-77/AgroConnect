import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { err: null };
  }

  static getDerivedStateFromError(err) {
    return { err };
  }

  componentDidCatch(err, info) {
    console.error("App crashed:", err, info);
  }

  render() {
    if (this.state.err) {
      return (
        <div style={{ padding: 20, fontFamily: "system-ui" }}>
          <h2>App crashed ❌</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {String(this.state.err?.stack || this.state.err)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
