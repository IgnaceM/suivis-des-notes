import { Eye, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import Navigation from "../composants/Navigation";

export default function Exercise() {
  let [count, setCount] = useState(0)

  const [isPair, setIsPair] = useState(false)

  const [cours, setCours] = useState([])
  const [maxima, setMaxima] = useState("")
  const [nom, setNom] = useState("")

  const [coursActif , setCoursActif] = useState(null)

  const incrementer = () => {
    setCount((prev) => prev + 1)
    if (count % 2 === 0) {
      setIsPair(true)
    } else {
      setIsPair(false)
    }
  }

  const ajouterCours = () => {
    const newCours = { id: Date.now(), nom: nom, maxima: maxima }
    setCours([...cours, newCours])
    setNom("")
    setMaxima("")
  }

  const deleteCours = (id)=> {
    setCours(cours.filter((c)=> c.id !== id))
  }

  const ouvrir = (id)=> {
    const coursAct = cours.find((c)=> c.id === id)
    setCoursActif(coursAct)
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-5 justify-center items-center">
        <button className={`mt-10 text-3xl font-bold ${!isPair ? "text-red-500" : "text-black"}`}>{count}</button>
        <button className="px-3 py-2 bg-gray-100 border-2 border-gray-200 font-bold w-fit rounded " onClick={incrementer}>Incrémenter</button>
      </div>

      <div className="px-5 mt-5">
        <input type="text" className="border w-full p-3" value={nom} onChange={(e) => setNom(e.target.value)}
          placeholder="nom du cours"
        />

        <input type="text" className="border w-full p-3 mt-5" value={maxima} onChange={(e) => setMaxima(e.target.value)}
          placeholder="maxima du cours"
        />

        <button onClick={ajouterCours} className="p-3 mt-3 bg-sky-500 flex items-center gap-2 text-white rounded-md"> <PlusCircle /> Ajouter</button>
      </div>

      <div className="px-5 mt-3">
        <ul>
          {Array.isArray(cours) && cours.map((cour) => (
            <div key={cour.id} className="flex items-center gap-5">
              <p>{cour.nom} - {cour.maxima}</p>
              <button onClick={()=> ouvrir(cour.id)}><Eye size={16} className="text-sky-500"/></button>
              <button onClick={()=> deleteCours(cour.id)}><Trash2 size={16}/></button>

              {coursActif && (
                <div>
                  <p>Details du cours</p>
                  <p>Nom : {coursActif.nom}</p>
                  <p>Max : {coursActif.maxima}</p>
                </div>
              )}
            </div>
          ))}
        </ul>

      </div>

      <Navigation />
    </div>
  )
}