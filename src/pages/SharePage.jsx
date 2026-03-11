
import { useEffect, useMemo, useRef, useState } from "react";
import { useCourses } from "../context/CoursesContext";

// === Cercle global avec animation ===
function CircleIndicator({ percentage }) {
  const [displayed, setDisplayed] = useState(0);
  let [bgCont, setBgCont] = useState("22c55e");

  useEffect(() => {
    if (displayed >= 80) {
      setBgCont("#22c55e")

    }

    if (displayed >= 60 && displayed < 80) {
      setBgCont("#fde047")
    }

    if (displayed >= 50 && displayed < 60) {

      setBgCont("#fb923c ")
    }

    if (displayed < 50) {
      setBgCont("#ef4444")
    }
  }, [displayed])

  useEffect(() => {
    let start = 0;
    const step = () => {
      start += 1;
      if (start <= percentage) {
        setDisplayed(start);
        requestAnimationFrame(step);
      }
    };
    step();
  }, [percentage]);

  return (
    <div className="relative w-40 h-40 mx-auto mb-6">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${bgCont} ${displayed * 3.6}deg, #e5e7eb ${displayed * 3.6
            }deg)`
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center font-bold text-xl">
        {displayed}%
      </div>
    </div>
  );
}

// === Mini-graphique tendance ===
function TrendChart({ grades }) {
  if (!grades.length) return <p className="text-gray-400">Aucune note</p>;

  const maxGrade = Math.max(...grades.map((g) => g.points)) || 1;

  return (
    <div className="flex w-full gap-7 md:gap-5 justify-start md:justify-center items-end h-32">
      {grades.map((g, i) => {
        const height = (g.points / maxGrade) * 100;
        const color =
          g.points >= g.max * 0.8
            ? "bg-green-500"
            : g.points >= g.max * 0.5
              ? "bg-yellow-400"
              : "bg-red-500";
        return (
          <div key={i} className="flex flex-col items-center md:justify-center  md:items-center text-xs">
            <div
              className={`${color} w-4 lg:w-5 transition-all duration-700`}
              style={{ height }}
            />
            <span className="text-[9px] whitespace-nowrap flex text-gray-500">{g.points} / {g.max}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function PartagerPage() {
  const { courses, calculateCourseAverage } = useCourses();
  const exportRef = useRef();

  const { overallPercentage, bestCourse, worstCourse, ranking } = useMemo(() => {
    let totalMaxima = 0;
    let totalWeighted = 0;
    let best = null;
    let worst = null;

    const ranking = courses.map((c) => {
      const moyenne = calculateCourseAverage(c);
      const bestGrade = c.grades.length
        ? Math.max(...c.grades.map((g) => g.points))
        : 0;
      totalMaxima += c.maxima;
      totalWeighted += moyenne;
      return {
        id: c.id,
        name: c.name,
        moyenne,
        max: c.maxima,
        bestGrade,
        nbNotes: c.grades.length,
        grades: c.grades
      };
    });

    ranking.sort((a, b) => b.moyenne - a.moyenne);
    if (ranking.length > 0) {
      best = ranking[0];
      worst = ranking[ranking.length - 1];
    }

    const overall = totalMaxima > 0 ? (totalWeighted / totalMaxima) * 100 : 0;
    return { overallPercentage: overall, bestCourse: best, worstCourse: worst, ranking };
  }, [courses, calculateCourseAverage]);

  const handlePrint = () => window.print();

  const handleDownloadImage = () => {
    const node = exportRef.current;
    const svg = new XMLSerializer().serializeToString(node);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "partage.svg";
    link.click();
  };

  return (
    <div ref={exportRef} className="p-6 space-y-8 pb-32 pt-24 px-5 md:px-20 lg:px-44 bg-gray-50 min-h-screen print:bg-white">
      {/* Cercle global */}
      <section className="text-center">
        <h1 className="text-2xl font-bold mb-4">Résumé général</h1>
        <CircleIndicator percentage={overallPercentage} />
        <p className="text-gray-600">
          {overallPercentage >= 75
            ? "Objectif atteint ✅"
            : `Encore ${(75 - overallPercentage).toFixed(1)}% à atteindre`}
        </p>
      </section>

      {/* Cartes rapides */}
      <section className="grid md:grid-cols-3 gap-4 text-center">
        <div className="p-4 border rounded shadow bg-white">
          <h3 className="font-bold text-lg mb-2">Meilleur cours</h3>
          {bestCourse ? (
            <>
              <p className="font-semibold">{bestCourse.name}</p>
              <p className="text-green-600 text-xl font-bold">
                {((bestCourse.moyenne / bestCourse.max) * 100).toFixed(1)}%
              </p>
            </>
          ) : (
            <p>Aucun cours</p>
          )}
        </div>
        <div className="p-4 border rounded shadow bg-white">
          <h3 className="font-bold text-lg mb-2">Cours le plus faible</h3>
          {worstCourse ? (
            <>
              <p className="font-semibold">{worstCourse.name}</p>
              <p className="text-red-600 text-xl font-bold">
                {((worstCourse.moyenne / worstCourse.max) * 100).toFixed(1)}%
              </p>
            </>
          ) : (
            <p>Aucun cours</p>
          )}
        </div>
        <div className="p-4 border rounded shadow bg-white">
          <h3 className="font-bold text-lg mb-2">Nombre total de notes</h3>
          <p className="text-blue-600 text-2xl font-bold">
            {courses.reduce((acc, c) => acc + c.grades.length, 0)}
          </p>
        </div>
      </section>

      {/* Grille des cours */}
      <section>
        <h2 className="text-xl flex justify-center py-10 font-bold mb-4">Détails par cours</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 z-0 w-full">
          {ranking.map((c) => (
            <div key={c.id} className="relative border min-w-full rounded shadow p-4  flex flex-col md:justify-center md:items-center overflow-x-auto space-y-2">
              <div className="sticky left-0 z-10 inline-block top-0 w-full">
              <h3 className="font-semibold text-lg">{c.name}</h3>
              <p className="text-gray-500">
                Moyenne :{" "}
                <span className="font-bold text-gray-800">
                  {((c.moyenne / c.max) * 100).toFixed(1)}%
                </span>
              </p>
              <p className="flex md:justify-center font-bold mb-5">Tendances</p>
              </div>
              
              <div className="min-w-max">
                <TrendChart grades={c.grades} />

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Boutons */}
      <div className=" z-0 top-0 right-4 flex gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Imprimer
        </button>
        <button
          onClick={handleDownloadImage}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Télécharger SVG
        </button>
      </div>
    </div>
  );
}



