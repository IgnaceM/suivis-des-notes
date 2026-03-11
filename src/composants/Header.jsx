import { Calendar, ChevronDown, ChevronUp, ClipboardList, Menu, Moon, MoreVertical, School, Sun, User, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Assets/Logo.png";
import { useCourses } from "../context/CoursesContext";
import Loading from "./Loading";
import LoadingProgress from "./LoadingProgress";


const Header = () => {

  const { pathname } = useLocation();

  const navigate = useNavigate();
  const { calculateOverall, overallMode, courses, toggleTheme, theme, periodeActive, periodes,
    changerPeriode, load, importData, exportData, confirm, message, type, confirmImport, loading, setLoading, menu, setMenu, menu2, setMenu2 } = useCourses();

  const [niveau, setNiveau] = useState("");
  const [colorStyle, setColorStyle] = useState("");

  const [bgStyle, setBgStyle] = useState("")

  const [openHistory, setOpenHistory] = useState(false)


  const overall = useMemo(() => {
    return calculateOverall({ ignoreEmpty: overallMode === "real" });
  }, [overallMode, courses])
  const { percentage, average, countedCourses, totalCourses } = overall;


  const { user } = useCourses();

  const getValue = (val) => (val && val.trim() !== "" ? val : "---");

  const boxRef = useRef(null);
  const boxRef2 = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setMenu(false);

      }
    }

    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });



  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef2.current && !boxRef2.current.contains(e.target)) {
        setMenu2(false);

      }
    }

    if (menu2) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const BgCard = {
    red: {
      bg: "bg-red-500",
      light: "from-red-50 to-red-50",
      dark: "dark:from-red-950 dark:to-red-950",
      light2: "from-red-50 to-transparent",
      dark2: "dark:from-red-950/50 dark:to-transparent"
    },
    orange: {
      bg: "bg-orange-500",
      light: "from-orange-50 to-orange-50",
      dark: "dark:from-orange-950 dark:to-orange-950",
      light2: "from-orange-100 to-transparent",
      dark2: "dark:from-orange-900/50 dark:to-transparent"
    },
    yellow: {
      bg: "bg-yellow-500",
      light: "from-yellow-50 to-yellow-50",
      light2: "from-yellow-50 to-transparent",
      dark: "dark:from-yellow-950 dark:to-yellow-950",
      dark2: "dark:from-yellow-900/50 dark:to-transparent"
    },
    green: {
      bg: "bg-green-500",
      light: "from-green-50 to-green-50",
      dark: "dark:from-green-950 dark:to-green-950",
      light2: "from-green-100 to-transparent",
      dark2: "dark:from-green-950/50 dark:to-transparent"

    }
  }



  const BgHeader = {
    red: {
      light: "bg-red-50",
      dark: "dark:bg-red-950",
    },

    orange: {
      light: "bg-orange-100",
      dark: "dark:bg-orange-900",
    },

    yellow: {
      light: "bg-yellow-50",
      dark: "dark:bg-yellow-900/50",

    },

    green: {
      light: "bg-green-100 bg-green-100",
      dark: "dark:bg-green-950",
    }
  }

  useEffect(() => {

    if (percentage.replace("%", "") <= 49) {
      setColorStyle(BgCard.red);
      setBgStyle(BgHeader.red);
      setNiveau("Médiocre ")

    } else if (percentage.replace("%", "") >= 50 && percentage.replace("%", "") <= 59) {
      setColorStyle(BgCard.orange);
      setBgStyle(BgHeader.orange);
      setNiveau("moyen ")

    } else if (percentage.replace("%", "") >= 60 && percentage.replace("%", "") < 75) {
      setColorStyle(BgCard.yellow);
      setBgStyle(BgHeader.yellow);
      setNiveau("Très Bon ")
    }
    else if (percentage.replace("%", "") >= 75) {
      setColorStyle(BgCard.green);
      setBgStyle(BgHeader.green);
      setNiveau("Excellent ")
    }

    console.log(pathname);


  }, [percentage, periodeActive])

  function GotoPeriodeManager() {
    navigate("/periodeManager");
    setMenu(false);
  }


  return (
    <div>
      <header className={`fixed z-50 w-full mx-auto flex justify-between items-center shadow-sm backdrop-blur-3xl px-5 py-3 dark:text-gray-300 ${pathname === "/" ? "bg-transparent" : "dark:bg-zinc-800"}`}>
        {/* Menu hamburger toggle */}
        <div>
          {menu ? (
            <X
              size={24}
              className="cursor-pointer text-gray-800 dark:text-gray-300"
              onClick={() => setMenu(false)}
            />
          ) : (
            <Menu
              size={24}
              className="cursor-pointer text-gray-800 dark:text-gray-300"
              onClick={() => setMenu(true)}
            />
          )}
        </div>

        {/* Titre */}
        <div className="flex items-center gap-3">
          <p className="text-[16px] font-bold">Suivis des notes</p>

        </div>

        <div onClick={toggleTheme} className="-mr-5">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </div>

        {/* Menu 3 points */}
        <div>
          <MoreVertical
            size={20}
            className="cursor-pointer text-gray-800 dark:text-gray-300"
            onClick={() => setMenu2(!menu2)}
          />
        </div>



        {/* Menu contextuel */}
        {menu2 && (

          <div className="absolute w-full h-screen inset-0 bg-black bg-opacity-15 z-50 overflow-y-hidden">
            <div ref={boxRef2} className="absolute right-0 top-0 bg-gray-50 px-7 pr-28 py-6 shadow-lg dark:bg-zinc-800 dark:shadow-none dark:text-gray-300 flex flex-col gap-5 text-sm ">
              <label for="importer" className="">Importer</label>
              <input type="file" onChange={importData} id="importer" className="hidden" />

              <p className="" onClick={exportData}>Exporter</p>

              <p className="" onClick={() => { setMenu2(false); navigate("/about") }}>A propos</p>

              {/* <p className="" onClick={() => navigate("/")}>Partager</p> */}
            </div>
          </div>
        )}

      </header>

      <div className={`top-12 fixed inset-0 bg-black transition-all duration-500 ${menu ? "bg-opacity-30 z-50" : "bg-opacity-0 -z-10"}`}>
        <div ref={boxRef} className={`transition-all duration-500 w-[85%] p-6 h-full bg-white dark:bg-zinc-900 dark:text-gray-300 shadow-lg overflow-y-auto ${menu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="space-y-4">

            {/* <div className={`w-full -z-10 h-1/2 left-0 absolute top-0 bg-gradient-to-b ${colorStyle.light2} ${colorStyle.dark2}  to-transparent`}></div> */}

            {/* === Infos utilisateur === */}
            <div className="space-y-2 z-20">
              <img src={Logo} alt="" className="w-12 h-auto -mt-3 mb-2" />
              <p className="flex items-center gap-2 font-bold text-black whitespace-nowrap dark:text-white text-sm lowercase z-20"><User size={16} /> NOM :
                <span className="font-normal text-gray-700 text-xs dark:text-gray-300 ml-1 uppercase">{getValue(user.nom)}</span>
              </p>

              <p className="flex items-center gap-2 font-bold text-black text-sm lowercase dark:text-white whitespace-nowrap"><School size={16} /> ECOLE :
                <span className="font-normal text-gray-700 text-xs dark:text-gray-300 ml-1 uppercase">{getValue(user.ecole)}</span>
              </p>

              <p className="flex items-center gap-2 font-bold text-black text-sm dark:text-white lowercase"><ClipboardList size={16} /> CLASSE :
                <span className="font-normal text-gray-700 text-xs dark:text-gray-300 ml-1 uppercase">{getValue(user.classe)}</span>
              </p>



            </div>

            {/* === Période en cours === */}
            <div className="mt-4 space-y-1 mb-5">
              <p className="flex items-center gap-2 font-bold  text-sm dark:text-white mb-5"><Calendar size={16} /> Période en cours : <p className="text-sky-500 text-xs italic">{periodeActive}e Période</p> </p>

              <button onClick={() => setOpenHistory(!openHistory)} className=" w-full flex items-center gap-2 py-2 pl-5 text-black font-bold transition dark:text-white border-l-[1px] dark:border-gray-700 text-sm">
                Historique des périodes
                {openHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openHistory && (
                <ul className="space-y-2 pl-7 pt-4 pr-0 border-l-[1px] dark:border-gray-700 ">
                  {periodes.map((periode) => (
                    <li key={periode.id} className="flex items-center justify-between w-full ">
                      <span
                        className={`w-full flex justify-center cursor-pointer px-2 py-1 border-[1px] border-gray-300 bg-gray-100 dark:border-gray-700 rounded ${periode.id === periodeActive
                          ? "font-bold bg-sky-500 bg-opacity-10 text-sky-500 border-2 border-sky-300 dark:border-sky-700 dark:bg-opacity-10 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 dark:bg-gray-800"
                          }`}
                        onClick={() => changerPeriode(periode.id)}
                      >
                        {periode.nom}

                      </span>
                    </li>
                  ))}
                </ul>
              )}


            </div>

            {/* === Niveau actuel === */}

            {/* === Nouvelle période === */}
            <div className="">

              <button onClick={GotoPeriodeManager} className="w-fit bg-sky-500 dark:bg-sky-600 text-white font-bold py-1 rounded-lg hover:bg-sky-700 transition flex gap-2 items-center justify-center px-5 text-sm">
                Gestion des périodes
              </button>



            </div>
          </div>
        </div>
      </div>

      {load && <Loading duration={5000} message={"Chargement des données en cours..."} />}


      {loading && (
        <LoadingProgress type={loading} onClose={() => setLoading(null)} />
      )}

    </div>
  )
}

export default Header