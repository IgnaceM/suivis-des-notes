
import { Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Bar, Cell as BarCell, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Header from "../composants/Header";
import Loading from "../composants/Loading";
import Navigation from "../composants/Navigation";
import { useCourses } from "../context/CoursesContext";


// 🔹 Histogramme des notes par cours avec tooltip avancé
function TrendChart({ grades }) {
  if (!grades.length) return <p className="text-gray-400">Aucune note</p>;

  const maxGrade = Math.max(...grades.map(g => g.max), 1);
  const data = grades.map((g, i) => ({
    name: `Note n°${i + 1}`,
    points: g.points,
    max: g.max,
    percentage: (g.points / g.max) * 100,
    date: g.date,
    display: `${g.points}/${g.max}`
  }));

  const getBarColor = pct => pct >= 85 ? "#3b82f6" :
    pct >= 75 ? "#22c55e" :
      pct >= 60 ? "#fde047" :
        pct >= 50 ? "#fb923c" : "#ef4444";

  return (
    <ResponsiveContainer width="100%" height={100} >
      <BarChart data={data}>
        <XAxis dataKey="name" hide />
        <YAxis hide domain={[0, maxGrade]} />
        <Tooltip
          formatter={(value, name, props) => {
            const g = props.payload;
            return [`${g.points}/${g.max}`];
          }}
          activeDot={false}
        />
        <Bar dataKey="points" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <BarCell key={i} fill={getBarColor(entry.percentage)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// 🔹 Ligne de progression
function ProgressLine({ grades }) {
  if (!grades.length) return <p className="text-gray-400">Pas de progression</p>;

  const maxGrade = Math.max(...grades.map(g => g.max), 1);
  const data = grades.map((g, i) => ({
    name: `Note n°${i + 1}`,
    points: g.points,
    max: g.max,
    percentage: (g.points / g.max) * 100,
    date: g.date,
    display: `${g.points}/${g.max}`
  }));

  return (
    <ResponsiveContainer width="100%" height={80} className="focus:outline-none">
      <LineChart data={data} activeDot={false}>
        <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} dot={{ r: 0 }} activeDot={false} />
        <YAxis hide domain={[0, maxGrade]} />
        {/* <Tooltip
          formatter={(value, name, props) => {
            const g = props.payload;
            return [`${g.name}\n${ g.points}/${g.max}`];
          }}
          labelFormatter={()=> ""}
          contentStyle={{whiteSpace : "pre"}}
          activeDot={false}
        /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}

// 🔹 Analyse globale
export default function AnalysePage() {
  const { courses, calculateOverall, overallMode, periodeActive, load } = useCourses();
  const [goal, setGoal] = useState(75);
  const boxRef = useRef(null);

  const overall = useMemo(() => calculateOverall({ ignoreEmpty: overallMode === "real" }), [overallMode, courses, periodeActive]);

  const { ranking, totalGrades, bestCourse, worstCourse } = useMemo(() => {
    let totalGradesCount = 0;
    const ranking = courses.map(course => {
      const grades = course.grades[periodeActive] || [];
      totalGradesCount += grades.length;
      const moyenne = grades.length ? grades.reduce((sum, g) => sum + g.points / g.max * 100, 0) / grades.length : 0;
      return { ...course, grades, moyenne, bestGrade: Math.max(...grades.map(g => g.points / g.max * 100)), worstGrade: Math.min(...grades.map(g => g.points / g.max * 100)) };
    }).sort((a, b) => b.moyenne - a.moyenne);
    return { ranking, totalGrades: totalGradesCount, bestCourse: ranking[0] || null, worstCourse: ranking[ranking.length - 1] || null };
  }, [courses, periodeActive]);

  return (
    <>
      <Header />
      <main className="p-6 space-y-6 px-5 pb-32 pt-24 lg:px-40 dark:text-gray-400 text-xs dark:bg-zinc-900">
        <section className="text-center space-y-4">
          <h1 className="text-xl font-bold dark:text-white">Analyse globale</h1>
        </section>

        {load && <Loading duration={5000} message="sauvegarde en cours..." />}

        {/* Statistiques globales */}
        <section className="grid md:grid-cols-3 gap-4 text-center">
          {/* <div className="p-4 border rounded shadow flex flex-col items-center dark:border-gray-800 hover:scale-105 transition-transform">
            <Trophy size={20} /> <h3 className="font-bold text-md mb-2">Meilleure performance</h3>
            {bestCourse ? <><p className="font-semibold dark:text-white uppercase">{bestCourse.name}</p>
              <p className="text-green-600 text-xl font-bold">{bestCourse.moyenne.toFixed(1)}%</p></> : <p>Aucun cours</p>}
          </div> */}
          {/* <div className="p-4 border rounded shadow flex flex-col items-center dark:border-gray-800 hover:scale-105 transition-transform">
            <h3 className="font-bold text-md mb-2">Mauvaise performance</h3>
            {worstCourse ? <><p className="font-semibold dark:text-white uppercase">{worstCourse.name}</p>
              <p className="text-red-600 text-xl font-bold">{worstCourse.moyenne.toFixed(1)}%</p></> : <p>Aucun cours</p>}
          </div> */}
          <div className="p-4 border rounded shadow flex flex-col items-center dark:border-gray-800 hover:scale-105 transition-transform">
            <h3 className="font-bold text-md mb-2">Nombre de notes</h3>
            <p className="text-sky-500 text-2xl font-bold">{totalGrades}</p>
          </div>
        </section>

        <p className="w-full uppercase dark:text-white font-bold flex items-center gap-1 text-center justify-center py-2 px-2 rounded-md"><Star size={16} /> Top cours</p>
        <section className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          {ranking.map(c => (
            <div key={c.id} className="border rounded shadow p-4 flex flex-col space-y-4 bg-white dark:bg-transparent dark:border-gray-700">
              <h3 className="font-semibold text-[16px] dark:text-white uppercase">{c.name}</h3>
              <p className="text-black dark:text-white">Moyenne : <span className="font-bold text-gray-500">{c.moyenne.toFixed(1)}%</span></p>

              <p className="font-bold dark:text-white">Histogramme des notes</p>
              <TrendChart grades={c.grades} />
              <p className="font-bold dark:text-gray-300">Progression</p>
              <ProgressLine grades={c.grades} />
            </div>
          ))}
        </section>
      </main>
      <Navigation />
    </>
  );
}
