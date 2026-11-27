import {
  Info,
  Moon,
  MoveLeft,
  SunMedium,
  User
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourses } from "../context/CoursesContext";
import { useLanguage } from "../context/LanguageContext";


export default function SettingsPage() {
  const { theme, toggleTheme } = useCourses();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [openModal, setOpenModal] = useState(false);

  const { langue, setLangue } = useLanguage();

  const { user, updateUser } = useCourses();

  const getValue = (val) => (val && val.trim() !== "" ? val : "---");

  const navigate = useNavigate();

  const handleChange = (e) => {
    updateUser(e.target.name, e.target.value);
  };

  const boxRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpenModal(false);

      }
    }

    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const email = "suivisdesnotes@gmail.com";
  const subject = encodeURIComponent("bugs signalés ou suggestions")

  const link = "https://whatsapp.com/channel/0029Vb6i5kGKQuJLKNSKSJ2Y";


  return (
    <>
      <main className="p-6 py-16 pb-10 lg:px-40 space-y-6 text-xs dark:bg-zinc-900">
        <div className="fixed w-full top-0 left-0 flex items-center shadow font-bold gap-5 px-5 py-3 bg-white text-black dark:bg-zinc-800 dark:text-white">
          <button onClick={() => navigate("/")} className=""><MoveLeft /></button>
          <h1 className="dark:text-white mt-0 text-lg">Paramètres</h1>

        </div>

        <div className={`${openModal ? "fixed inset-0 w-full h-screen flex justify-center px-10  items-center bg-black bg-opacity-20 dark:bg-opacity-80 -top-5 z-50" : "hidden"} `}>
          <div ref={boxRef} className="w-full py-5 px-5 border bg-white rounded shadow dark:bg-zinc-800 dark:border-none ">
            <h1 className="text-md font-bold mb-4 ml-2 dark:text-white">Modifier le profil</h1>

            {["nom", "classe", "ecole"].map((field) => (
              <div key={field} className="mb-3">
                <label className="block capitalize mb-1 text-gray-500 dark:text-gray-100 ml-2">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                  className="mt-2 w-full border rounded border-gray-300 focus:outline-sky-500 dark:focus:outline-white p-2 dark:bg-transparent dark:text-gray-300 dark:border-white bg-transparent"
                />
              </div>
            ))}
            <div className="flex justify-end w-full mt-10 ">
              <button onClick={() => setOpenModal(false)} className="bg-sky-500 px-5 py-2 text-white font-bold dark:bg-zinc-700 rounded" >Sauvegarder</button>
            </div>

          </div>
        </div>


        {/* === Profil utilisateur === */}

        <section className="bg-white p-6 rounded-md shadow space-y-4 dark:bg-zinc-700 dark:bg-opacity-20 dark:text-gray-300">
          <h2 className="text-xs font-semibold flex items-center gap-2 text-sky-500 "><User /> Profil</h2>
          <div className="space-y-2">
            <p><span className="font-bold text-md">Nom :</span> {getValue(user.nom)}</p>
            <p><span className="font-bold text-md">Classe : </span>{getValue(user.classe)}</p>
            <p><span className="font-bold text-md">Ecole :</span> {getValue(user.ecole)}</p>
          </div>
          <button onClick={() => setOpenModal(true)} className="mt-3 px-4 py-1 bg-sky-500 text-white rounded transition font-bold  dark:bg-zinc-700">
            Modifier le profil
          </button>
        </section>


        {/* === Apparence === */}
        <section className="bg-white p-6 rounded-md shadow space-y-4 dark:bg-zinc-700 dark:bg-opacity-20 dark:text-gray-300">
          <h2 className="text-xs font-semibold flex items-center gap-2 text-sky-500 "><Moon /> Apparence</h2>
          <div className="flex items-center justify-between">
            <p className="w-full flex justify-between items-center py-2 text-md font-bold" onClick={toggleTheme}>{theme !== "dark" ? "Mode sombre" : "Mode claire"} {theme !== "dark" ? <Moon className="" /> : < SunMedium />} </p>
          </div>
          {/* <div className="flex items-center justify-between">
          <p className="text-md font-bold">Langue</p>
          <select
            value={langue}
            onChange={(e) => setLangue(e.target.value)}
            className="px-3 border-none py-1 dark:hover:bg-gray-700 dark:border-gray-700 dark:bg-zinc-700 outline-none"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div> */}
        </section>

        {/* === Informations légales === */}
        <section className="bg-white p-6 rounded-md shadow space-y-4 dark:bg-zinc-700 dark:bg-opacity-20 dark:text-gray-300">
          <h2 className="text-xs font-semibold flex items-center gap-2 text-sky-500 "><Info /> Aide</h2>
          <div className="flex flex-col gap-2">
            <div onClick={() => navigate("/faq")} className="py-4 border-b-[0.5px] dark:border-gray-700 ">
              <h1 className="text-md font-bold">FAQ</h1>
              <p className="text-gray-400">Questions fréquemment posées</p>
            </div>



            <a href={`mailto:${email} ? subject=${subject}`} >
              <div className="py-4 border-b-[0.5px] dark:border-gray-700 ">
                <h1 className="text-md font-bold">Commentaires</h1>
                <p className="text-gray-400">Signaler les bugs et nous dire ce qu'il faut améliorer</p>
              </div>

            </a>



            <div onClick={() => window.open(link, "_blank")} className="py-4 border-b-[0.5px] dark:border-gray-700 ">
              <h1 className="text-md font-bold">Rejoindre notre communauté WhatsApp</h1>
              <p className="text-gray-400">suivez nous sur WhatsApp pour bénéficier d'autres surprises.</p>
            </div>
          </div>
        </section>


        {/* <section className="bg-white p-6 rounded-md shadow space-y-4 dark:bg-zinc-700 dark:bg-opacity-20 dark:text-gray-300">
          <div>
            <h2 className="text-xs font-semibold flex items-center gap-2 text-sky-500 "><Info /> sur</h2>
          </div>

          <div onClick={() => navigate("/privacyPolicy")} className="py-4 border-b-[0.5px] dark:border-gray-700 ">
            <h1 className="text-md font-bold">Politique de confidentialité</h1>
          </div>

          <div onClick={() => navigate("/mentions")} className="py-4 border-b-[0.5px] dark:border-gray-700 ">
            <h1 className="text-md font-bold">Mentions légales</h1>
          </div>

          <div className="py-4 border-b-[0.5px] dark:border-gray-700 ">
            <h1 className="text-md font-bold">Version : 1.0.0</h1>
          </div>
        </section> */}
      </main>
    </>
  );
}
