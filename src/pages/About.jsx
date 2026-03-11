import { MoveLeft } from "lucide-react";
import Logo from "../Assets/Logo.png";
import { Navigate, useNavigate } from "react-router-dom";

export function About() {

  const navigate = useNavigate();

  return (
    <div className="pt-14 bg-white w-full min-h-screen">
      <div className="fixed top-0 left-0 right-0 flex items-center gap-5 px-5 py-2 bg-black text-white">

        <MoveLeft onClick={()=> navigate(-1)} />

        <h2 className="text-[15px] font-bold text-center">A propos</h2>
      </div>


      <div className="px-5 py-2">
        <div className="flex flex-col  justify-center items-center gap-3 py-2">
          <img src={Logo} className="w-20" alt="" />
          <p className="font-bold text-black uppercase">Suivis des notes App</p>
        </div>
        <p className="mb-4 mt-5">
          Cette application a été conçue pour simplifier la gestion et le suivi des cotations personnelles. Elle offre une solution complète pour les élèves souhaitant organiser leurs cours, suivre leurs notes, et analyser leurs performances tout au long des différentes périodes scolaires.
        </p>

        <h2 className="text-[15px] font-semibold mb-4 text-black uppercase">Fonctionnalités principales :</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li><strong className="text-black">Gestion des cours :</strong> Ajoutez facilement vos cours avec leurs maxima respectifs pour une évaluation précise.</li>
          <li><strong className="text-black">Saisie des cotations :</strong> Enregistrez les notes obtenues pour chaque cours sous forme de cotations (exemple : 4/5).</li>
          <li><strong className="text-black">Calcul automatique :</strong> L’application calcule en temps réel :
            <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
              <li>Le total analytique et la moyenne par cours</li>
              <li>Le total et la moyenne générale globale</li>
              <li>Le pourcentage global de réussite</li>
            </ul>
          </li>
          <li><strong className="text-black">Classement des cours :</strong> Visualisez rapidement vos meilleurs et moins bons cours grâce à un classement clair.</li>
          <li><strong className="text-black">Graphiques interactifs :</strong> Des représentations graphiques vous aident à mieux comprendre vos résultats et évolutions.</li>
          <li><strong className="text-black">Gestion des périodes scolaires :</strong> Organisez vos notes par périodes pour un suivi détaillé et structuré.</li>
        </ul>

        <h2 className="text-[15px] font-semibold mb-4 text-black uppercase">Sécurité et stockage</h2>
        <p className="mb-6">
          Toutes vos données sont stockées localement sur votre appareil (localStorage), garantissant la confidentialité de vos informations sans transfert vers des serveurs externes.
        </p>

        <h2 className="text-[15px] font-semibold mb-4 text-black uppercase">Objectif</h2>
        <p>
          L’objectif principal de cette application est de vous fournir un outil simple, efficace et accessible pour améliorer votre organisation et votre réussite scolaire.
        </p>
      </div>


    </div>
  );
};

export default About;
