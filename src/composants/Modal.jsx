import { useEffect, useRef } from "react";

export default function Modal({ title, children, onClose, setDeleteModalOpen, setEditModalOpen, deleteModalOpen, editModalOpen, periode }) {

  const boxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (e.target.closest(".modal-content") === null) {
        setDeleteModalOpen(false);
        setEditModalOpen(false)
      }
    }

    if ({ deleteModalOpen, editModalOpen }) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (

    <div className={`fixed inset-0 bg-black bg-opacity-40 dark:bg-opacity-80 flex justify-center items-center z-50`}>
      <div ref={boxRef} className="modal-content bg-white rounded shadow-lg p-6 w-80 dark:bg-zinc-800">
        <h2 className="text-md font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded dark:border-gray-600"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}