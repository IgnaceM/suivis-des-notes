import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppErrorBoundary from "./composants/AppErrorBoundary";
import { CoursesProvider } from "./context/CoursesContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register(`${process.env.PUBLIC_URL}/service-worker.js`)
			.catch((error) => console.error("Échec de l'enregistrement du service worker :", error));
	});
}
root.render(
	<AppErrorBoundary>
		<LanguageProvider>
			<CoursesProvider>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</CoursesProvider>
		</LanguageProvider>
	</AppErrorBoundary>
);

reportWebVitals();
