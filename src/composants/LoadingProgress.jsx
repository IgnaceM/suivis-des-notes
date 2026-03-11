import { useEffect, useState } from "react";
import { useCourses } from "../context/CoursesContext";

const LoadingProgress = ({ onClose }) => {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const {
    loading,
    setLoading,
    isImporting,
    isExporting,
    error,
    setError
  } = useCourses();

  // 🔹 Animation progressive tant que l’opération est en cours
  useEffect(() => {
    let interval;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < 95 ? prev + 1 : prev));
      }, 20);
    }

    return () => clearInterval(interval);
  }, [loading]);

  // 🔹 Fin réelle de l’opération
  useEffect(() => {
    if (!isImporting && !isExporting && loading) {
      setProgress(100);
      setCompleted(true);
    }
  }, [isImporting, isExporting, loading]);

  // 🔹 Fermeture propre
  const handleClose = () => {
    setProgress(0);
    setCompleted(false);
    setLoading("");
    setError(false);
    onClose();
  };

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-800 dark:text-white rounded-xl shadow-xl p-6 w-80 text-center">
        <h2 className="text-md font-semibold mb-4">
          {!completed
            ? loading === "import"
              ? "Importation en cours..."
              : "Exportation en cours..."
            : error
              ? "Erreur : fichier invalide"
              : loading === "import"
                ? "Importation réussie"
                : "Exportation terminée"}
        </h2>

        {!completed && (
          <>
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-sky-600 h-full transition-all duration-50 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-white">
              {progress.toFixed(0)}%
            </p>
          </>
        )}

        {completed && (
          <button
            onClick={handleClose}
            className="mt-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
          >
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default LoadingProgress;