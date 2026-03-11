import { createContext, useContext, useEffect, useState } from "react";

const CoursesContext = createContext();

export function useCourses() {
  return useContext(CoursesContext);
}

export function CoursesProvider({ children }) {
  // ============================
  // 1️⃣ - ÉTAT DES PÉRIODES
  // ============================
  const [periodes, setPeriodes] = useState(() => {
    const saved = localStorage.getItem("periodes");
    return saved
      ? JSON.parse(saved)
      : [{ id: 1, nom: "1ère période" }];
  });

  const [periodeActive, setPeriodeActive] = useState(() => {
    const saved = localStorage.getItem("periodeActive");
    return saved ? parseInt(saved) : 1;
  });

  useEffect(() => {
    localStorage.setItem("periodeActive", periodeActive);
  }, [periodeActive]);

  useEffect(() => {
    localStorage.setItem("periodes", JSON.stringify(periodes));
  }, [periodes]);

  // ============================
  // 2️⃣ - ÉTAT DES COURS
  // ============================
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("courses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);

  // ============================
  // 3️⃣ - FONCTIONS COURS
  // ============================

  // Validation d’un cours complet
  function validateCourse(course) {
    if (
      !course ||
      (typeof course.id !== "string" && typeof course.id !== "number") ||
      typeof course.name !== "string" ||
      !course.name.trim() ||
      typeof course.maxima !== "number" ||
      course.maxima <= 0 ||
      typeof course.grades !== "object"
    ) return false;

    for (const periodeId in course.grades) {
      const grades = course.grades[periodeId];
      if (!Array.isArray(grades)) return false;

      for (const grade of grades) {
        if (
          (typeof grade.id !== "string" && typeof grade.id !== "number") ||
          typeof grade.points !== "number" ||
          grade.points < 0 ||
          typeof grade.max !== "number" ||
          grade.max <= 0 ||
          grade.points > grade.max ||
          typeof grade.date !== "string" ||
          !grade.date.trim()
        ) return false;
      }
    }

    return true;
  }

  // Validation d’une note avant ajout
  function validateGrade(points, max) {
    return typeof points === "number" && points >= 0 &&
      typeof max === "number" && max > 0 &&
      points <= max;
  }

  // Validation d’un nom de cours
  function validateCourseName(name) {
    if (typeof name !== "string") return false;
    const trimmed = name.trim();
    if (!trimmed) return false;
    // interdit caractères < > pour éviter injection
    if (/[<>]/.test(trimmed)) return false;
    return true;
  }


  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2)
  }

  const addCourse = (name, maxima) => {
    if (periodeActive !== 1) {
      return;
    }
    if (!validateCourseName(name) || typeof maxima !== "number" || maxima <= 0) {
      ActionCourse("Nom ou maxima invalide", "error");
      return;
    }

    const cleanName = name.trim().toLowerCase();
    const exists = courses.some(
      (c) => c.name.trim().toLowerCase() === cleanName
    );

    if (exists) {
      ActionCourse("Ce cours existe déjà", "error");
      return;
    }



    const newCourse = {
      id: generateId(), // ID sécurisé
      name: name.trim(),
      maxima,
      grades: { [periodeActive]: [] },
    };

    setCourses((prev) => {
      const updated = [newCourse, ...prev]
      return updated;
    });

    ActionCourse("Cours ajouté avec succès", "add");
  };


  const deleteCourse = (id) => {
    // if (periodeActive !== 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const addGrade = (courseId, points, max, generateId) => {
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).slice(2)
    }

    if (!validateGrade(points, max)) {
      ActionCourse("Note ou maximum invalide", "error");
      return;
    }

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
            ...c,
            grades: {
              ...c.grades,
              [periodeActive]: [
                ...(c.grades[periodeActive] || []),
                { id: generateId(), points, max, date: new Date().toLocaleDateString() },
              ],
            },
          }
          : c
      )
    );
  };


  const editCourse = (courseId, newName, newMaxima) => {
    // if (periodeActive !== 1) return;
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, name: newName, maxima: newMaxima } : c))
    );
  };

  const editGrade = (courseId, gradeId, newPoints, newMax) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
            ...c,
            grades: {
              ...c.grades,
              [periodeActive]: c.grades[periodeActive].map((g) =>
                g.id === gradeId ? { ...g, points: newPoints, max: newMax } : g
              ),
            },
          }
          : c
      )
    );
  };

  const deleteGrade = (courseId, gradeId) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
            ...c,
            grades: {
              ...c.grades,
              [periodeActive]: c.grades[periodeActive].filter((g) => g.id !== gradeId),
            },
          }
          : c
      )
    );
  };

  // ============================
  // 4️⃣ - CALCULS
  // ============================
  function calculateCourseAverage(course) {
    const notes = course.grades[periodeActive] || [];
    if (!notes.length) return 0;
    const totalPoints = notes.reduce((sum, g) => sum + g.points, 0);
    const totalMax = notes.reduce((sum, g) => sum + g.max, 0);
    return totalMax > 0 ? (totalPoints / totalMax) * course.maxima : 0;
  }

  function calculTotalPoints(course) {
    const notes = course.grades[periodeActive] || [];
    return notes.reduce((sum, g) => sum + g.points, 0);
  }

  function calculTotalMax(course) {
    const notes = course.grades[periodeActive] || [];
    return notes.reduce((sum, g) => sum + g.max, 0);
  }

  function calculTotal() {
    let totalP = 0;
    let totalM = 0;
    courses.forEach((course) => {
      totalP += calculTotalPoints(course);
      totalM += calculTotalMax(course);
    });
    return { totalP, totalM };
  }

  function calculateOverall({ ignoreEmpty = false } = {}) {
    let totalWeighted = 0;
    let totalMaxima = 0;
    let countedCourses = 0;
    courses.forEach((course) => {
      const notes = course.grades[periodeActive] || [];
      const avg = calculateCourseAverage(course);
      if (ignoreEmpty) {
        if (notes.length > 0) {
          totalWeighted += avg;
          totalMaxima += course.maxima;
          countedCourses++;
        }
      } else {
        totalWeighted += avg;
        totalMaxima += course.maxima;
        if (notes.length > 0) countedCourses++;
      }
    });
    const percentage = totalMaxima > 0 ? (totalWeighted / totalMaxima) * 100 : 0;
    return {
      average: `${totalWeighted.toFixed(1)}/${totalMaxima}`,
      percentage: `${percentage.toFixed(1)}%`,
      countedCourses,
      totalCourses: courses.length,
    };
  }

  const [niveau, setNiveau] = useState("")

  // ============================
  // 5️⃣ - MODES ET THÈME
  // ============================
  const [overallMode, setOverallMode] = useState(() => localStorage.getItem("overallMode") || "real");

  useEffect(() => {
    localStorage.setItem("overallMode", overallMode);
  }, [overallMode]);

  const setMode = (mode) => setOverallMode(mode);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // ============================
  // 6️⃣ - INFORMATIONS UTILISATEUR
  // ============================
  const [user, setUser] = useState({ nom: "", classe: "", ecole: "" });

  useEffect(() => {
    const saved = localStorage.getItem("userData");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  const updateUser = (field, value) => setUser((prev) => ({ ...prev, [field]: value }));

  // ============================
  // 7️⃣ - GESTION DES ACTIONS ET ALERTES
  // ============================
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const ActionCourse = (message, type) => {
    setConfirm(true);
    setMessage(message);
    setType(type);
    setTimeout(() => setConfirm(false), 5000);
  };

  // ============================
  // 8️⃣ - GESTION DES PÉRIODES
  // ============================
  function creerNouvellePeriode() {
    setPeriodes((prev) => {
      const derniere = prev[prev.length - 1];
      const nouvelleId = derniere ? derniere.id + 1 : 1;
      const nouvellePeriode = { id: nouvelleId, nom: `${nouvelleId}ᵉ période` };

      // Ajoute la nouvelle période à tous les cours existants avec grades vides
      setCourses((coursesPrev) =>
        coursesPrev.map((course) => ({
          ...course,
          grades: { ...course.grades, [nouvelleId]: [] },
        }))
      );

      setPeriodeActive(nouvelleId);
      return [...prev, nouvellePeriode];
    });
  }

  function deletePeriode(id) {
    if (periodeActive !== 1) {
      setPeriodes((prev) => prev.filter((c) => c.id !== id));
      setCourses((prev) =>
        prev.map((c) => {
          const newGrades = { ...c.grades };
          delete newGrades[id];
          return { ...c, grades: newGrades };
        })
      );
      setPeriodeActive(id - 1);
    }
  }

  const [load, setLoad] = useState(false);

  const duration = 500

  const [menu, setMenu] = useState(false);

  const [number, setNumber] = useState(periodeActive)
  function changerPeriode(id) {
    setMenu(false)
    setLoad(true)
    setTimeout(() => {
      setPeriodeActive(id);
      setLoad(false)
      ActionCourse("Période active", "add");
    }, duration);

  }

  const [importProgress, setImportProgress] = useState(0);
  const [exportProgress, setExportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false)

  const [confirmImport, setConfirmImport] = useState(false)

  const [loading, setLoading] = useState("");

  const [menu2, setMenu2] = useState(false)


  // Dans votre fichier CoursesContext.js
  const exportData = async () => {
    setLoading("export");
    setIsExporting(true);
    setError(false);
    setMenu2(false);

    const start = Date.now();

    try {
      // ✅ Données préparées
      const data = {
        courses,
        periodes,
        periodeActive,
        user: user || {} // jamais null
      };

      const json = JSON.stringify(data);

      // ✅ Création du fichier
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // ✅ Téléchargement
      const link = document.createElement("a");
      link.href = url;
      link.download = "Mes_Données_Suivis_Des_Notes_App.json";
      link.click();

      // 🔹 Nettoyage mémoire
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 500 - elapsed);

      // 🔹 Temps minimal pour l'animation
      setTimeout(() => {
        setIsExporting(false);
      }, remaining);
    }
  };





  const [error, setError] = useState(false)

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    setLoading("import");
    setIsImporting(true);
    setError(false);
    setMenu2(false);

    const start = Date.now();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // ✅ Vérification minimale des structures
        if (
          !Array.isArray(data.courses) ||
          !Array.isArray(data.periodes) ||
          !data.periodeActive ||
          !data.user ||
          typeof data.user !== "object"
        ) {
          throw new Error("Structure invalide");
        }

        // ✅ Vérification des champs essentiels de chaque cours
        const periodeIds = data.periodes.map(p => p.id);

        const normalizedCourses = data.courses.map(course => {
          if (!course.id || !course.name || typeof course.maxima !== "number") {
            throw new Error("Cours invalide détecté");
          }

          const grades = typeof course.grades === "object" ? { ...course.grades } : {};

          // 🔹 Normalisation : s’assure que toutes les périodes existent
          for (const id of periodeIds) {
            if (!grades[id]) grades[id] = [];
          }

          return { ...course, grades };
        });

        // ✅ Normalisation de periodeActive (string ou number)
        const periodeActiveNum = parseInt(data.periodeActive);
        if (isNaN(periodeActiveNum)) throw new Error("periodeActive invalide");

        // ✅ Mise à jour des states
        setCourses(normalizedCourses);
        setPeriodes(data.periodes);
        setPeriodeActive(periodeActiveNum);
        setUser(data.user);

      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, 500 - elapsed);

        // 🔹 Temps minimal pour l'animation
        setTimeout(() => {
          setIsImporting(false);
        }, remaining);
      }
    };

    reader.readAsText(file);
    event.target.value = ""; // reset input pour permettre ré-import
  };



  // ============================
  // 9️⃣ - FOURNITURE DU CONTEXTE
  // ============================
  return (
    <CoursesContext.Provider
      value={{
        // Cours et notes
        courses,
        addCourse,
        deleteCourse,
        addGrade,
        editCourse,
        editGrade,
        deleteGrade,
        // Calculs
        calculateCourseAverage,
        calculateOverall,
        calculTotalPoints,
        calculTotalMax,
        calculTotal,
        // Modes
        overallMode,
        setMode,
        // Thème
        theme,
        toggleTheme,
        // Utilisateur
        user,
        updateUser,
        // Alertes
        confirm,
        setConfirm,
        message,
        setMessage,
        type,
        setType,
        ActionCourse,
        // Périodes
        periodes,
        periodeActive,
        creerNouvellePeriode,
        changerPeriode,
        setPeriodeActive,
        deletePeriode,

        //Loading

        load,
        setLoad,
        menu,
        setMenu,

        //import export

        importData,
        exportData,
        importProgress,
        exportProgress,
        isImporting,
        isExporting,
        confirmImport,
        loading,
        setLoading,
        menu2,
        setMenu2,
        error,
        setError

      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}




