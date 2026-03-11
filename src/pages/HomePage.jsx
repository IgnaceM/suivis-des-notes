import { useEffect, useMemo, useRef, useState } from "react";
import Confirmation from "../composants/Confirmation";
import Header from "../composants/Header";
import Navigation from "../composants/Navigation";
import { useCourses } from "../context/CoursesContext";



const stylesMap = {
  red: {
    bg: "bg-red-500/30",
    light: "from-red-500/25",
    lightDarkMode: "dark:from-red-900/50",
    shadow: "shadow-red-600/60",
    color: "text-red-600",
    border: "border-red-600",
  },
  yellow: {
    bg: "bg-yellow-500/30",
    light: "from-yellow-500/25",
    lightDarkMode: "dark:from-yellow-800/80",
    shadow: "shadow-yellow-500/60",
    color: "text-yellow-400",
    border: "border-yellow-300",
  },
  orange: {
    bg: "bg-orange-500/30",
    light: "from-orange-500/25",
    lightDarkMode: "dark:from-orange-800/60",
    shadow: "shadow-orange-500/60",
    color: "text-orange-600",
    border: "border-orange-500",
  },
  green: {
    bg: "bg-green-500/30",
    light: "from-green-500/25",
    lightDarkMode: "dark:from-green-900/70",
    shadow: "shadow-green-500/60",
    color: "text-green-600",
    border: "border-green-500",
  },

  gold: {
    bg: "bg-blue-400/30",
    light: "from-blue-400/25",
    lightDarkMode: "dark:from-blue-800/70",
    shadow: "shadow-blue-500/60",
    color: "text-blue-500",
    border: "border-blue-600",
  },
};

export default function HomePage() {
  const { theme, toggleTheme, calculateOverall, calculTotal, overallMode, setMode, courses, confirm, message, type, ActionCourse, periodeActive } = useCourses();
  const { totalP, totalM } = calculTotal();

  const [showInfo, setShowInfo] = useState(false);

  const boxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowInfo(false);
      }
    }

    if (showInfo) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showInfo]);

  // --- Mode de calcul : "real" ou "global"


  const overall = useMemo(() => {
    return calculateOverall({ ignoreEmpty: overallMode === "real" });
  }, [overallMode, courses, periodeActive])
  const { percentage, average, countedCourses, totalCourses } = overall;

  // --- Couleur selon le pourcentage
  const [colorStyle, setColorStyle] = useState(stylesMap.red);
  const [niveau, setNiveau] = useState("");

  useEffect(() => {
    const pct = parseFloat(String(percentage || "0").replace("%", "")) || 0;
    if (pct <= 49) {
      setColorStyle(stylesMap.red);
      setNiveau("Débutant");
    } else if (pct >= 50 && pct <= 59) {
      setColorStyle(stylesMap.orange);
      setNiveau("Élémentaire");
    } else if (pct >= 60 && pct < 75) {
      setColorStyle(stylesMap.yellow);
      setNiveau("Intermédiaire");
    } else if (pct >= 75 && pct < 85) {
      setColorStyle(stylesMap.green);
      setNiveau("Avancé");
    } else if (pct >= 85) {
      setColorStyle(stylesMap.gold);
      setNiveau("Gold");
    }
  }, [percentage]);

  const handleSetGlobal = () => {
    ActionCourse("Affichage Global sélectionné", "edit");
    setShowInfo(false);
    setMode("global");
  };

  const handleSetReal = () => {
    ActionCourse("Affichage réel sélectionné", "edit");
    setShowInfo(false);
    setMode("real");
  };

  // --- Info mode


  return (
    <>
      <Header />
      <main className="absolute inset-0 w-full h-full flex flex-col text-center items-center bg-white dark:bg-gray-950 justify-center overflow-y-scroll dark:text-gray-300 z-60">
        <h1 className="text-sm font-bold mb-3 text-gray-500 dark:text-gray-300 z-20 py-1 px-6 rounded-full">
          Moyenne Générale
        </h1>

        <div className={`w-full z-10 h-1/3 absolute top-0 bg-gradient-to-b ${colorStyle.light} ${colorStyle.lightDarkMode} to-transparent`}>

        </div>
        {showInfo && (
          <div className="fixed w-full h-full inset-0 bg-black bg-opacity-30 dark:bg-opacity-80 z-50 flex justify-center items-center px-10">
            <div ref={boxRef} className="max-w-md bg-gray-100 dark:bg-zinc-800 p-4 shadow mb-5 text-sm text-gray-700 dark:text-gray-300 py-10 flex flex-col justify-center items-center gap-5 rounded-md">
              <div className="w-full flex justify-center">
                <p className="font-bold text-black text-md dark:text-white">Sélectionnez un mode d'affichage</p>
              </div>

              <p className="text-xs">
                <strong>Global :</strong> Tous les cours sont comptés. Les cours sans notes sont considérés comme 0%.
              </p>

              <button
                className={`px-2 w-fit py-1 rounded border-2 border-gray-300 ${overallMode === "global"
                  ? "bg-sky-100 dark:bg-sky-600 dark:text-white border-2 border-sky-400 text-sky-500 font-bold"
                  : "bg-gray-200 dark:bg-zinc-700 dark:text-gray-300 dark:border-gray-600"
                  }`}
                onClick={handleSetGlobal}
              >
                Global (cours vides = 0%)
              </button>

              <p className="mt-2 text-xs">
                <strong>Réel :</strong> Seuls les cours ayant au moins une note sont pris en compte. Les cours vides sont ignorés.
              </p>
              <button
                className={`px-2 py-1 rounded w-fit border-2 border-gray-300 ${overallMode === "real"
                  ? "bg-sky-100 dark:bg-sky-600 dark:text-white text-sky-500 font-bold border-2 border-sky-500"
                  : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  }`}
                onClick={handleSetReal}
              >
                Réel (cours cotés uniquement)
              </button>

            </div>
          </div>

        )}

        {/* --- Cercle de pourcentage */}
        <div
          className={`relative text-4xl font-extrabold border-2 flex justify-center items-center w-[145px] h-[145px] rounded-full z-20 ${colorStyle.color} ${colorStyle.border}`}
        >
          <div className={`absolute bg-opacity-30 ${colorStyle.shadow} ${colorStyle.bg} w-[90%] h-[90%] rounded-full shadow-lg animate-spin-slow`}>

          </div>
          <div
            className={`shadow-2xl p-5 rounded-full w-[90%] h-[90%] mb-1 flex justify-center items-center`}
          >
            {percentage}
          </div>

        </div>

        {countedCourses !== totalCourses && (
          <button className="z-20" onClick={() => setShowInfo(true)} aria-label="Sélection mode affichage">
            <p className="px-5 py-1 border-2 border-sky-300 mt-3 bg-sky-50 dark:bg-sky-600 dark:bg-opacity-20 dark:border-sky-800 rounded-2xl text-xs font-bold">Sélectionnez le mode d'affichage</p>
          </button>
        )}
        <p className="font-bold flex items-center gap-2 dark:text-white text-xs capitalize mt-3">
          Niveau :
          <span className={`font-bold py-1 text-xs rounded-full flex items-center justify-center gap-1 capitalize ${colorStyle.color} `}>
            {niveau}
          </span>

        </p>
        {/* --- Indicateur période */}
        <div className="flex gap-2 items-center mt-2 text-sm text-gray-500 dark:text-gray-300">
          <div className={`w-2 h-2 rounded-full ${colorStyle.bg} animate-ping-slow`}></div>
          <p className="dark:text-gray-300 text-xs">{periodeActive}e période active </p>
        </div>


        {/* --- Bouton toggle theme */}

        {/* --- Moyenne et total */}
        {/* <p className="text-gray-500 dark:text-gray-300 mt-2 text-xs">
          Moyenne générale fractionnaire : {average}
        </p>
        <p className="text-gray-500 dark:text-gray-300 text-xs mt-2">
          Total Général : {totalP} / {totalM}
        </p> */}
        <Confirmation message={message} type={type} confirm={confirm} />
        <Navigation />
      </main>
    </>

  );
}
