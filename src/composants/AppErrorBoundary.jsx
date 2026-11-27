import React from "react";

export default class AppErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error("Échec du démarrage de l'application :", error, errorInfo);
	}

	render() {
		if (!this.state.hasError) {
			return this.props.children;
		}

		return (
			<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-6 text-center text-gray-800">
				<h1 className="text-xl font-bold">L’application n’a pas pu démarrer</h1>
				<p>
					Mettez Chrome à jour, puis réessayez. Vos données enregistrées n’ont pas été
					effacées.
				</p>
				<button
					type="button"
					className="rounded-lg bg-sky-600 px-5 py-3 font-semibold text-white"
					onClick={() => window.location.reload()}
				>
					Réessayer
				</button>
			</main>
		);
	}
}
