import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../composants/Modal";
import { useCourses } from "../context/CoursesContext";
import { Edit, Eye, FolderPlus, Trash2 } from "lucide-react";
import Confirmation from "../composants/Confirmation";
import Header from "../composants/Header";
import Navigation from "../composants/Navigation";

export default function CoursesPage() {
  const {
    courses,
    addCourse,
    editCourse,
    deleteCourse,
    confirm,
    message,
    type,
    ActionCourse,
    periodeActive,
  } = useCourses();

  const [name, setName] = useState("");
  const [maxima, setMaxima] = useState("");
  const navigate = useNavigate();
  const [courseToDelete, setCourseToDelete] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // =====================
  // Validation côté UI
  // =====================
  function isValidCourseName(name) {
    const trimmed = name.trim();
    return trimmed && !/[<>]/.test(trimmed);
  }

  function isValidMaxima(max) {
    const num = parseFloat(max);
    return !isNaN(num) && num > 0;
  }

  // =====================
  // Ajout d’un cours
  // =====================
  function handleAddCourse(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedMaxima = parseFloat(maxima);

    if (!isValidCourseName(trimmedName)) {
      ActionCourse("Nom de cours invalide", "error");
      return;
    }
    if (!isValidMaxima(parsedMaxima)) {
      ActionCourse("Maxima invalide", "error");
      return;
    }

    addCourse(trimmedName, parsedMaxima);
    setName("");
    setMaxima("");
  }

  // =====================
  // Edition d’un cours
  // =====================
  function handleEditSave() {
    if (!courseToEdit) return;

    const trimmedName = courseToEdit.name.trim();
    const parsedMaxima = parseFloat(courseToEdit.maxima);

    if (!isValidCourseName(trimmedName)) {
      ActionCourse("Nom de cours invalide", "error");
      return;
    }
    if (!isValidMaxima(parsedMaxima)) {
      ActionCourse("Maxima invalide", "error");
      return;
    }

    editCourse(courseToEdit.id, trimmedName, parsedMaxima);
    ActionCourse("Modifications enregistrées", "edit");
    setEditModalOpen(false);
  }

  // =====================
  // Suppression d’un cours
  // =====================
  function handleDeleteCourse() {
    if (!courseToDelete) return;
    deleteCourse(courseToDelete.id);
    ActionCourse("Suppression réussie", "delete");
    setCourseToDelete(null);
    setDeleteModal(false);
  }

  return (
    <>
      <Header />
      <main className="p-6 pb-32 pt-20 w-full md:max-w-lg mx-auto dark:text-gray-300 dark:bg-zinc-900 text-xs min-h-screen">
        <p className="text-xs text-sky-500">{periodeActive}e période</p>
        <h1 className="text-xl font-bold mb-2 flex items-center gap-2">Liste des cours</h1>

        {periodeActive !== 1 && (
          <p className="mb-2 text-gray-400">
            Pour un soucis de cohérence et d'ordre, il n'est possible d'ajouter, modifier ou supprimer un cours que si c'est la première période qui est active.
          </p>
        )}

        {/* Formulaire ajout */}
        <form onSubmit={handleAddCourse} className="mb-6 space-y-3 mt-5">
          <input
            type="text"
            placeholder="Nom du cours"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:bg-transparent dark:border-gray-700 focus:outline-sky-500 dark:focus:outline-sky-950 focus:border-none"
            required
            disabled={periodeActive !== 1}
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Maxima (points)"
              value={maxima}
              onChange={(e) => setMaxima(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-transparent dark:border-gray-700 focus:outline-sky-500 dark:focus:outline-sky-950 focus:border-none"
              required
              min="1"
              disabled={periodeActive !== 1}
            />
            <button
              type="submit"
              className={`w-full text-white py-2 rounded flex justify-center items-center gap-2 dark:bg-zinc-700 ${
                periodeActive !== 1
                  ? "bg-gray-200 dark:bg-zinc-700/40 dark:text-gray-600"
                  : "bg-sky-500"
              }`}
              disabled={periodeActive !== 1}
            >
              <FolderPlus /> Ajouter
            </button>
          </div>
        </form>

        {/* Liste des cours */}
        <ul className="space-y-4">
          {courses.length === 0 && (
            <p className="text-gray-500">Aucun cours ajouté pour l’instant.</p>
          )}

          {courses.map((course) => (
            <li
              key={course.id}
              className="flex flex-col gap-5 items-center border p-3 rounded shadow-sm dark:bg-transparent dark:border-gray-700"
            >
              <div className="w-full flex justify-between ">
                <h1 className="font-semibold text-black capitalize dark:text-white">{course.name}</h1>
                <span className="text-gray-600 dark:text-gray-300 italic">Maxima : {course.maxima}</span>
              </div>

              <div className="grid w-full grid-cols-3 gap-1 bg-gray-100 py-6 px-2 dark:bg-gray-950 dark:bg-opacity-20">
                <button
                  className="px-2 border-[1px] border-blue-300 bg-blue-50 rounded text-sky-500 flex justify-center items-center gap-0.5 dark:bg-opacity-20 dark:bg-blue-500 dark:border-sky-700"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <Eye size={16} /> Ouvrir
                </button>

                <button
                  onClick={() => {
                    setCourseToEdit({ ...course });
                    setEditModalOpen(true);
                  }}
                  className={`py-1 bg-gray-50 border-[1px] rounded flex justify-center items-center gap-0.5 dark:bg-gray-500/30 dark:text-gray-300 dark:border-gray-600 ${
                    periodeActive === 1 ? "text-gray-500 border-2 border-gray-200" : "text-gray-300 dark:text-gray-700 dark:bg-zinc-800 dark:border-none cursor-not-allowed"
                  }`}
                  disabled={periodeActive !== 1}
                >
                  <Edit size={16} /> Modifier
                </button>

                <button
                  onClick={() => {
                    setCourseToDelete(course);
                    setDeleteModal(true);
                  }}
                  className={`border-[1px] rounded font-bold flex justify-center items-center gap-0.5 ${
                    periodeActive !== 1
                      ? "bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-gray-700 cursor-not-allowed border-2 border-gray-200 dark:border-none font-normal"
                      : "text-red-600 border-red-300 bg-red-50 rounded hover:text-red-800 dark:bg-opacity-20 dark:bg-red-500 dark:border-red-700"
                  }`}
                  title="Supprimer le cours"
                  disabled={periodeActive !== 1}
                >
                  <Trash2 size={16} /> Supp
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Modal Édition */}
        {editModalOpen && courseToEdit && (
          <Modal
            setDeleteModalOpen={setDeleteModal}
            setEditModalOpen={setEditModalOpen}
            title="Éditer le cours"
            onClose={() => setEditModalOpen(false)}
          >
            <p className="mt-5 text-gray-500 text-sm mb-3 dark:text-gray-300">Changer le nom du cours</p>
            <input
              type="text"
              value={courseToEdit.name}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, name: e.target.value })}
              className="w-full mb-3 p-2 border rounded dark:bg-transparent dark:border-white focus:outline-sky-300 dark:focus:outline-none"
            />

            <p className="mt-5 text-gray-500 text-sm mb-3 dark:text-gray-300">Changer le maxima du cours</p>
            <input
              type="number"
              value={courseToEdit.maxima}
              onChange={(e) => setCourseToEdit({ ...courseToEdit, maxima: e.target.value })}
              className="w-full mb-4 p-2 border rounded dark:bg-transparent dark:border-white focus:outline-sky-300 dark:focus:outline-none"
            />

            <button
              onClick={handleEditSave}
              className="px-4 py-2 bg-sky-500 dark:bg-zinc-700 text-white rounded"
            >
              Sauvegarder
            </button>
          </Modal>
        )}

        {/* Modal Suppression */}
        {deleteModal && courseToDelete && (
          <Modal
            setDeleteModalOpen={setDeleteModal}
            setEditModalOpen={setEditModalOpen}
            title="⚠️Supprimer ce cours ?"
            onClose={() => setDeleteModal(false)}
          >
            <p className="-mt-3 mb-3 text-red-500 flex">Attention ! cette action est irréversible</p>
            <p>Nom : {courseToDelete.name}</p>
            <p>Maxima : {courseToDelete.maxima}</p>
            <button
              className="px-5 py-2 rounded mt-5 bg-red-600 text-white"
              onClick={handleDeleteCourse}
            >
              Supprimer
            </button>
          </Modal>
        )}

        <Confirmation message={message} type={type} confirm={confirm} />
      </main>
      <Navigation />
    </>
  );
}
