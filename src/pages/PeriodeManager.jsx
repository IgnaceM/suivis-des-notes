import { Calendar, MoveLeft, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../composants/Loading";
import Modal from "../composants/Modal";
import { useCourses } from "../context/CoursesContext";


export default function PeriodeManager() {
  const {
    periodes,
    periodeActive,
    creerNouvellePeriode,
    changerPeriode,
    deletePeriode,
    load,
    duration
  } = useCourses();

  const navigate = useNavigate();
  const activePeriode = periodes.find((periode) => periode.id === periodeActive);

  const [deleteModal, setDeleteModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [periodeToDelete, setPeriodeToDelete] = useState(null);

  // Supprimer une période
  const handleDelete = () => {
    if (periodeToDelete) {
      deletePeriode(periodeToDelete.id);
      setPeriodeToDelete(null);
      setDeleteModal(false);
    }
  };

  return (
    <div className="text-xs min-h-screen dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center gap-4 text-white bg-sky-500 dark:bg-zinc-800 p-5 font-bold">
        <MoveLeft onClick={() => navigate(-1)} />
        <h1>Gestion des périodes</h1>
      </div>

      <div className="p-5">
        {/* Période active */}
        <h2 className="text-md font-bold text-gray-900 dark:text-gray-100 flex items-center my-3 gap-3">
          <Calendar size={20} />
          Période active :{" "}
          <span className="text-sky-500 dark:text-sky-500">
            {activePeriode ? activePeriode.nom : "—"}
          </span>
        </h2>

        {/* Créer nouvelle période */}
        <button
          onClick={creerNouvellePeriode}
          className="mb-3 px-4 py-2 bg-sky-500 dark:bg-zinc-700 text-white rounded-lg flex items-center gap-2"
        >
          <PlusCircle size={16} />
          Créer une nouvelle période
        </button>

        {/* Historique des périodes */}
        <div className="mt-2">
          <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Historique des périodes :
          </h3>
          <ul className="space-y-2">
            {periodes.map((periode) => (
              <li
                key={periode.id}
                className={`flex items-center justify-between px-5 py-3 rounded ${periode.id === periodeActive
                  ? "border-[0.5px] border-sky-400 bg-sky-500 bg-opacity-10 dark:bg-opacity-15"
                  : "text-gray-700 bg-gray-50 shadow dark:text-gray-300 dark:bg-gray-800"
                  }`}
              >
                {/* Changer période */}
                <span
                  onClick={() => !load && changerPeriode(periode.id)}
                  className={`cursor-pointer w-full h-full ${periode.id === periodeActive
                    ? "font-bold text-sky-500 dark:text-sky-600"
                    : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                  {periode.nom}
                </span>

                {/* Supprimer sauf première période */}
                {periode.id !== 1 && periodes.length > 1 && (
                  <button
                    onClick={() => {
                      setPeriodeToDelete(periode);
                      setDeleteModal(true);
                    }}
                    className={`cursor-pointer ${periode.id === periodeActive
                      ? "font-bold text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                      }`}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal suppression */}
      {deleteModal && periodeToDelete && (
        <Modal
          setDeleteModalOpen={setDeleteModal}
          setEditModalOpen={setEditModalOpen}
          title="⚠️ Supprimer cette période ?"
          onClose={() => setDeleteModal(false)}
        >
          <p className="-mt-3 mb-3 text-red-500 flex">
            Attention ! Cette action est irréversible
          </p>
          <p className="font-bold">{periodeToDelete.nom}</p>
          <button
            className="px-5 py-2 rounded mt-5 bg-red-600 text-white"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </Modal>
      )}

      {/* Loading */}
      {load && <Loading duration={duration || 500} message="Chargement des données en cours..." />}
    </div>
  );
}
