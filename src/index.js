import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CoursesProvider } from "./context/CoursesContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
if ("serviceWorker" in navigator) {
	window.addEventListener("load", () => {
		navigator.serviceWorker
			.register("/service-worker.js")
			.then((reg) => console.log("Service Worker enregistré:", reg))
			.catch((err) => console.log("Erreur SW:", err));
	});
}
root.render(
	<LanguageProvider>
		<CoursesProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</CoursesProvider>
	</LanguageProvider>
);

reportWebVitals();
