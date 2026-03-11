import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate(-1)
  return (
    <div className="pt-20 pb-10 bg-white min-h-full">
      <div className="fixed top-0 left-0 right-0 flex items-center gap-5 p-5 bg-black text-white">

        <MoveLeft onClick={() => navigate(-1)} />

        <h2 className="text-[15px] font-bold text-center">Politique de confidentialité</h2>
      </div>

      {/* Contenu */}
      <section className="bg-white text-gray-700 space-y-6 leading-5 px-5 text-sm">
        <p>
          La protection de vos données personnelles est une priorité pour nous. Cette application de suivis des notes est conçue pour stocker localement vos informations afin de garantir leur confidentialité et leur sécurité.
        </p>

        <ol className="list-decimal list-inside space-y-4">
          <li>
            <strong className="text-black">Collecte et stockage des données :</strong><br />
            Toutes les données que vous saisissez dans l’application (notes, pourcentages, périodes, etc.) sont enregistrées uniquement dans le <em>stockage local</em> de votre appareil (localStorage). Aucune information n’est transférée ni stockée sur nos serveurs ou tiers.
          </li>

          <li>
            <strong className="text-black">Utilisation des données :</strong><br />
            Les données enregistrées sont utilisées exclusivement pour vous permettre de suivre et calculer vos cotations personnelles. Elles ne sont ni partagées ni utilisées à d’autres fins.
          </li>

          <li>
            <strong className="text-black">Licence d’utilisation :</strong><br />
            L’accès à l’application se fait via un code de licence valide. Ce code sert uniquement à activer l’application et ne requiert aucune collecte de données personnelles.
          </li>

          <li>
            <strong className="text-black">Cookies et technologies similaires :</strong><br />
            Cette application n’utilise pas de cookies ni de technologies de suivi.
          </li>

          <li>
            <strong className="text-black">Sécurité :</strong><br />
            Puisque les données sont stockées localement sur votre appareil, il est recommandé de sécuriser l’accès à votre appareil afin de protéger vos informations.
          </li>

          <li>
            <strong className="text-black">Modifications de la politique de confidentialité :</strong><br />
            Cette politique peut être modifiée périodiquement pour se conformer aux évolutions légales et techniques. Nous vous invitons à la consulter régulièrement.
          </li>
        </ol>

        <section>
          <h2 className="text-lg font-semibold mb-2 text-black">Contact</h2>
          <p>
            Pour toute question ou demande concernant cette politique de confidentialité ou l’utilisation de l’application, vous pouvez nous contacter à l’adresse email suivante :{" "}
            <a href="mailto:suivisdesnotes@gmail.com" className="text-blue-600 underline">
              suivisdesnotes@gmail.com
            </a>.
            Nous nous engageons à répondre dans les meilleurs délais.
          </p>
        </section>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
