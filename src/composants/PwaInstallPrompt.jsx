import { useEffect, useState } from "react";

export default function PwaInstallPrompt() {
	const [installPrompt, setInstallPrompt] = useState(null);
	const [dismissed, setDismissed] = useState(false);

	useEffect(() => {
		function handleBeforeInstallPrompt(event) {
			event.preventDefault();
			setInstallPrompt(event);
		}

		function handleAppInstalled() {
			setInstallPrompt(null);
		}

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);

		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);

	async function installApp() {
		try {
			await installPrompt.prompt();
			await installPrompt.userChoice;
			setInstallPrompt(null);
		} catch (error) {
			console.error("Impossible de lancer l'installation de l'application :", error);
		}
	}

	return (
		<>
			{installPrompt && !dismissed && (
				<div className="fixed bottom-20 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl bg-white p-4 text-gray-800 shadow-lg dark:bg-zinc-900 dark:text-gray-100">
					<p className="text-sm font-medium">Installer Suivis des notes sur cet appareil</p>
					<div className="flex shrink-0 gap-2">
						<button
							type="button"
							className="rounded-lg px-2 py-2 text-sm text-gray-500"
							onClick={() => setDismissed(true)}
						>
							Plus tard
						</button>
						<button
							type="button"
							className="rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white"
							onClick={installApp}
						>
							Installer
						</button>
					</div>
				</div>
			)}
		</>
	);
}
