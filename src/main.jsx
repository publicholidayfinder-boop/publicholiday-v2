import { StrictMode, Component } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full border-l-4 border-red-500">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-4">The application crashed with the following error:</p>
            <pre className="bg-slate-900 text-red-400 p-4 rounded-lg overflow-x-auto text-sm">
              {this.state.error && this.state.error.toString()}
            </pre>
            <p className="mt-4 text-sm text-slate-500">Check the browser console for more details.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
const app = (
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
