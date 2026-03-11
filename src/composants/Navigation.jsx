
import { BarChartBig, BookOpen, ExternalLink, Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";



export default function Navigation() {
  const { pathname } = useLocation();

  return (
    <footer className={`fixed bottom-0 w-full flex justify-between bg-gray-100 shadow transition-all duration-500 dark:bg-zinc-800 text-red-500 dark:text-gray-300 px-5 py-0 right-0 text-xs`}>
      <div className="transition-all duration-500 active:bg-sky-500 rounded-full">
        <Link to="/" className={pathname === "/" ? " font-bold text-sky-500 flex flex-col items-center p-2 rounded-full" : "flex flex-col items-center text-gray-500 dark:text-gray-300  p-2 "}>
          <div className={pathname === "/" ? "bg-sky-500 px-4 rounded-lg bg-opacity-10 py-1" : "bg-sky-500 px-4 rounded-lg bg-opacity-0 py-1"}>
            <Home  size={20} />
          </div>
          <p>Accueil</p>
        </Link>
      </div>

      <div className="transition-all duration-500 active:bg-sky-500 rounded-full">
        <Link
          to="/courses"
          className={pathname === "/courses" ? "font-bold  flex flex-col items-center  p-2 rounded-full text-sky-500" : "flex flex-col items-center text-gray-500 dark:text-gray-300 p-2"}
        >
          <div className={pathname === "/courses" ? "bg-sky-500 px-4 rounded-lg bg-opacity-10 py-1" : "bg-sky-500 px-4 rounded-lg bg-opacity-0 py-1"}>
            <BookOpen size={20} />
          </div>
          <p>Cours</p>
        </Link>
      </div>

      <div className="transition-all duration-500 active:bg-sky-500 rounded-full">
        <Link
          to="/analysePage"
          className={pathname === "/analysePage" ? "font-bold  flex flex-col items-center  p-2 rounded-full text-sky-500" : "flex flex-col items-center text-gray-500 dark:text-gray-300 p-2"}
        >
          <div className={pathname === "/analysePage" ? "bg-sky-500 px-4 rounded-lg bg-opacity-10 py-1" : "bg-sky-500 px-4 rounded-lg bg-opacity-0 py-1"}>
            <BarChartBig size={20} />
          </div>
          <p>Analyse</p>
        </Link>
      </div>

      <div className="transition-all duration-500 active:bg-sky-500 rounded-full">
        <Link
          to="/settingsPage"
          className={pathname === "/settingsPage" ? "font-bold  flex flex-col text-sky-500  rounded-full items-center p-2" : "flex flex-col items-center justify-center text-gray-500 dark:text-gray-300 p-2 "}
        >
          <div className={pathname === "/settingsPage" ? "bg-sky-500 px-4 rounded-lg bg-opacity-10 py-1" : "bg-sky-500 px-4 rounded-lg bg-opacity-0 py-1"}>
            <Settings size={20} />
          </div>
          <p>Paramètres</p>
        </Link>
      </div>

    </footer>
  );
}