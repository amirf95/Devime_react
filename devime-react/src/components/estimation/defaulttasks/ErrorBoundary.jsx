import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20 }}>
          <h2 style={{ color: "#b91c1c" }}>Une erreur est survenue dans ce composant</h2>
          <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#fff", padding: 12 }}>
            {String(this.state.error)}
            {this.state.info?.componentStack ? "\n\n" + this.state.info.componentStack : ""}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
