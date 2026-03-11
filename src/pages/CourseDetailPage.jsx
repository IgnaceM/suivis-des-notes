import { Edit, MoveLeft, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confirmation from "../composants/Confirmation";
import Header from "../composants/Header";
import Modal from "../composants/Modal";
import { useCourses } from "../context/CoursesContext";

export default function CourseDetailPage() {
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    courses,
    addGrade,
    editGrade,
    deleteGrade,
    calculateCourseAverage,
    calculTotalPoints,
    calculTotalMax,
    confirm,
    message,
    type,
    ActionCourse,
    periodeActive,
  } = useCourses();

  // 🔹 Click outside pour fermer modals
  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setDeleteModalOpen(false);
        setEditModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [points, setPoints] = useState("");
  const [max, setMax] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState(null);
  const [gradeToDelete, setGradeToDelete] = useState(null);

  const course = courses.find((c) => c.id === id);
  if (!course) return <p className="p-4 text-red-600">Cours non trouvé.</p>;

  const grades = course.grades[periodeActive] || [];
  const moyenne = calculateCourseAverage(course);
  const totalPoints = calculTotalPoints(course);
  const totalMax = calculTotalMax(course);
  const percentageGlobal = (moyenne * 100) / course.maxima;

  // 🔹 Fonction  pour couleur selon pourcentage
  function getPercentageColor(value) {
    if (value >= 85) return "text-blue-500";
    if (value >= 75) return "text-green-400";
    if (value >= 60) return "text-yellow-500";
    if (value >= 50) return "text-orange-500";
    return "red-600";
  }

  function getBadgeColor(value) {
    if (value >= 85) return "bg-blue-500";
    if (value >= 75) return "bg-green-400";
    if (value >= 60) return "bg-yellow-500";
    if (value >= 50) return "bg-orange-500";
    return "red-600";
  }

  // 🔹 Validation stricte des notes
  function isValidGrade(points, max) {
    const pts = parseFloat(points);
    const mx = parseFloat(max);
    return !isNaN(pts) && !isNaN(mx) && pts >= 0 && mx > 0 && pts <= mx;
  }

  // 🔹 Ajouter une note (toujours en tête de liste)
  function handleAddGrade(e) {
    e.preventDefault();
    if (!isValidGrade(points, max)) {
      ActionCourse("Valeurs invalides", "error");
      return;
    }
    addGrade(id, parseFloat(points), parseFloat(max));
    ActionCourse("Note ajoutée avec succès", "add");
    setPoints("");
    setMax("");
  }

  // 🔹 Modifier une note
  function handleEditSave() {
    if (!gradeToEdit) return;
    if (!isValidGrade(gradeToEdit.points, gradeToEdit.max)) {
      ActionCourse("Valeurs invalides", "error");
      return;
    }
    editGrade(
      id,
      gradeToEdit.id,
      parseFloat(gradeToEdit.points),
      parseFloat(gradeToEdit.max)
    );
    ActionCourse("Note modifiée avec succès", "edit");
    setEditModalOpen(false);
    setGradeToEdit(null);
  }

  // 🔹 Supprimer une note
  function handleDeleteConfirm() {
    if (!gradeToDelete) return;
    deleteGrade(id, gradeToDelete.id);
    ActionCourse("Note supprimée avec succès", "delete");
    setDeleteModalOpen(false);
    setGradeToDelete(null);
  }

  return (
    <>
      <Header />
      <main className="p-6 relative max-w-lg mx-auto pb-32 pt-16 dark:text-gray-300 dark:bg-zinc-900 min-h-screen text-xs">
        <button
          onClick={() => navigate("/courses")}
          className="mb-0 bg-white py-2 left-0 z-30 text-sky-500 backdrop-blur-lg flex justify-start gap-2 hover:underline dark:bg-transparent"
        >
          <MoveLeft size={16} />
          <p>Retour</p>
        </button>

        <div className="w-full flex justify-between items-center">
          <h1 className="text-md text-sky-500 font-bold uppercase">{course.name}</h1>
          <p>Max : {course.maxima}</p>
        </div>

        <div className="flex justify-between items-center my-4">
          <p>TOT GEN : {totalPoints} / {totalMax}</p>
          <p>|</p>
          <p>MOY GEN : {moyenne.toFixed(1)} / {course.maxima}</p>
        </div>

        <p className="mb-5 flex items-center gap-1">
          Taux de réussite général :{" "}
          <span className={`${getPercentageColor(percentageGlobal)}`}>
            {percentageGlobal.toFixed(1)} %
          </span>
        </p>

        {/* 🔹 Ajouter une note */}
        <p className="mb-2 text-gray-500 text-xs">Ajouter une note</p>
        <form onSubmit={handleAddGrade} className="mb-6 space-y-3">
          <input
            type="number"
            placeholder="Points obtenus"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full p-2 border rounded dark:bg-transparent dark:border-gray-700 focus:outline-sky-300 dark:focus:outline-sky-950 focus:border-none"
            required
            min="0"
            step="0.5"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Maxima"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full p-2 border rounded dark:bg-transparent dark:border-gray-700 focus:outline-sky-300 dark:focus:outline-gray-950 focus:border-none"
              required
              min="1"
            />
            <button className="w-full bg-sky-500 text-white flex items-center justify-center gap-2 py-2 rounded dark:bg-zinc-700">
              <PlusCircle /> Ajouter la note
            </button>
          </div>
        </form>

        {/* 🔹 Liste des notes (dernière note en haut) */}
        <ul className="space-y-4">
          {grades.length === 0 && <p className="text-gray-500">Aucune note.</p>}
          {[...grades].reverse().map((grade, i) => (
            <li key={grade.id} className="flex flex-col border-[0.5px] p-3 rounded shadow-sm dark:border-gray-700 dark:bg-gray-700 dark:bg-opacity-10">
              <div>
                <div className="w-full flex justify-end">
                  <span className="text-[10px] text-gray-500 dark:text-gray-300 italic">Ajoutée le {grade.date}</span>
                </div>
                <div className="flex gap-5 mt-5 justify-center items-center border-[1px] px-2 py-4 w-full dark:border-gray-800 rounded-lg">
                  <div className="flex gap-4 justify-center items-center">
                    <div className="px-3 bg-sky-50 border-2 border-sky-300 dark:border-sky-700 py-2 font-bold dark:bg-sky-500 dark:bg-opacity-20 rounded whitespace-nowrap">
                      Note n° {grades.length - i}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-9 h-9 border-2 flex justify-center items-center font-semibold dark:border-gray-700 rounded">{grade.points}</div>
                    <p>/</p>
                    <div className="w-9 h-9 border-2 flex justify-center items-center font-semibold dark:border-gray-700 rounded">{grade.max}</div>
                  </div>
                  <div>
                    <p className={`italic w-2 h-2 rounded-full -mr-3 ${getBadgeColor((grade.points * 100) / grade.max)}`}></p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full justify-center mt-5">
                <button onClick={() => { setGradeToEdit({ ...grade }); setEditModalOpen(true); }}
                  className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 border-[1px] border-gray-300 flex items-center justify-center gap-2 py-1 px-2 dark:bg-gray-500 dark:bg-opacity-20 dark:border-gray-700 rounded">
                  <Edit size={16} /> Modifier
                </button>
                <button onClick={() => { setGradeToDelete(grade); setDeleteModalOpen(true); }}
                  className="text-red-600 dark:text-red-600 border-[1px] border-red-300 hover:bg-red-100 flex items-center py-1 px-2 justify-center gap-2 dark:bg-red-500 dark:bg-opacity-20 dark:border-red-700 rounded">
                  <Trash2 size={16} /> Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* 🔹 Modal Édition */}
        {editModalOpen && gradeToEdit && (
          <Modal setDeleteModalOpen={() => { }} setEditModalOpen={setEditModalOpen} title="Éditer la note" onClose={() => setEditModalOpen(false)}>
            <p className="text-gray-500 mb-2 dark:text-gray-300">Points obtenus</p>
            <input
              type="number"
              value={gradeToEdit.points}
              onChange={(e) => setGradeToEdit({ ...gradeToEdit, points: e.target.value })}
              className="w-full mb-3 p-2 border rounded dark:bg-transparent dark:border-white focus:outline-white dark:focus:outline-white"
              min="0"
            />
            <p className="text-gray-500 mb-2 mt-5 dark:text-gray-300">Maxima</p>
            <input
              type="number"
              value={gradeToEdit.max}
              onChange={(e) => setGradeToEdit({ ...gradeToEdit, max: e.target.value })}
              className="w-full mb-4 p-2 border rounded dark:bg-transparent dark:border-white focus:outline-white dark:focus:outline-white"
              min="1"
            />
            <button onClick={handleEditSave} className="px-4 py-2 bg-sky-500 dark:bg-zinc-600 text-white rounded">Sauvegarder</button>
            <p className="mt-5 text-red-500 text-xs">NB : Les points obtenus ne doivent pas surpasser le maxima</p>
          </Modal>
        )}

        {/* 🔹 Modal Suppression */}
        {deleteModalOpen && gradeToDelete && (
          <Modal setDeleteModalOpen={setDeleteModalOpen} setEditModalOpen={() => { }} title="⚠️Supprimer cette note ?" onClose={() => setDeleteModalOpen(false)}>
            <p className="-mt-3 mb-3 text-red-500 flex">Attention ! cette action est irréversible</p>
            <p className="mb-4">{gradeToDelete.points}/{gradeToDelete.max} - {gradeToDelete.date}</p>
            <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
          </Modal>
        )}

        <Confirmation message={message} confirm={confirm} type={type} />
      </main>
    </>
  );
}
