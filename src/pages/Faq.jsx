import { ChevronDown, ChevronUp, MoveLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Faq() {
  const faqData = [
    {
      question: "Comment fonctionne la gestion des périodes dans l’application ?",
      answer: "Chaque période est une section distincte vous permettant d’ajouter des cotations pour un intervalle donné (ex: 1er période, 2ème période, ...).",
    },
    {
      question: "Comment sécuriser mes données personnelles sur l’application ?",
      answer: "Protégez votre appareil (mot de passe/biométrie) et utilisez la fonction d’export pour sauvegarder vos données localement.",
    },
    {
      question: "Quel format est utilisé pour l’import/export des données ?",
      answer: "Les données sont exportées au format JSON, lisible et réutilisable facilement pour importation.",
    },

    {
      question : "Comment l’application calcule-t-elle mes moyennes ?",
      answer : "L’application calcule d’abord la moyenne de chaque matière séparément, en utilisant les notes que tu as entrées et le maximum possible pour ce cours. Ensuite, elle calcule la moyenne générale en faisant la moyenne de toutes les matières.",
    },

    {
      question : "Qu'est ce que le maxima d'un cours ?",
      answer : "Le maxima d'un cours, c'est la note maximale possible que vous pouvez obtenir pour ce cours. ",
    },

    {
      question : "Que se passe-t-il si un cours n’a pas encore de note ?",
      answer : "Si un cours est vide, sa moyenne vaut 0. Tu peux aussi activer le mode d'affichage “réel”, pour que ces cours ne soient pas pris en compte dans la moyenne générale.",
    },

    {
      question : "Mes données sont-elles sauvegardées automatiquement",
      answer : "Toutes les données sont sauvegardées automatiquement sur l'appareil. Elles resteront disponibles même si vous fermez ou redémarrez l’application.",
    }
    // Ajoute d'autres questions ici...
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="pt-20 bg-white w-full min-h-screen">
      <div className="fixed top-0 left-0 right-0 flex items-center gap-5 p-5 bg-black text-white">
        <Link to="/settingsPage">
          <MoveLeft/>
        </Link>
        <h2 className="text-[15px] font-bold text-center">Foire aux questions (FAQ)</h2>
      </div>
      <div className="px-5 py-2">
         {faqData.map((item, index) => (
        <div key={index} className="border-b border-gray-300 py-4">
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between text-left"
          >
            <h3 className="text-[15px] text-gray-800 font-semibold">{item.question}</h3>
            {openIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={20} />}
          </button>
          {openIndex === index && (
            <p className="mt-2 text-[13px] text-gray-500 font-medium transition-all duration-300 leading-5">
              {item.answer}
            </p>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

