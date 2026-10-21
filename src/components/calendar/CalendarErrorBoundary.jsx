import React from 'react';

export default class CalendarErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Calendar Rendering Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex-grow flex items-center justify-center p-6 bg-slate-950 text-white min-h-[500px]">
                    <div className="bg-slate-900 border border-red-500/30 p-8 rounded-xl max-w-lg w-full text-center shadow-2xl">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-red-400 mb-2">Oops, something went wrong</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            The calendar encountered an unexpected error while rendering.
                        </p>
                        <div className="bg-slate-950 text-slate-500 text-xs p-3 rounded text-left overflow-auto mb-6 max-h-32 font-mono">
                            {this.state.error && this.state.error.toString()}
                        </div>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
