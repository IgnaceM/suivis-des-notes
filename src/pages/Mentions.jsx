import { MoveLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Mentions() {
  const navigate = useNavigate()
  return (
    <div className="w-full bg-white min-h-screen pt-20">
      {/* Header fixe */}
      <div className="fixed top-0 left-0 right-0 bg-black text-white flex items-center px-4 py-3  shadow-md z-50">
        <button
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="mr-4 hover:text-gray-400 focus:outline-none"
        >
          <MoveLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[15px] font-bold">Mentions légales</h1>
      </div>

      {/* Contenu avec padding pour compenser header fixe */}
      <main className=" px-5 text-black text-sm">
        <section className="mb-6">
          <h2 className="font-bold text-black text-[16px] mb-2">Propriété intellectuelle</h2>
          <p>
            L’ensemble des contenus présents dans l’application (textes, images, logos, code source, design) sont la propriété exclusive de [Ton Nom ou Société] ou de ses partenaires.
            Toute reproduction, distribution, modification, ou exploitation partielle ou totale sans autorisation écrite est strictement interdite et constitutive de contrefaçon.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-black text-[16px] mb-2">Protection des données personnelles</h2>
          <p>
            Pour activer l'application, un code de licence est nécessaire. ce code, ainsi que les informations liées à l'activations (identifient de l'appareil, date d'activation) sont transmis et stocker dans une base de donnée sécuriser pour vérifier la validité de la licence. ces données ne sont ni partagées ni exploitées par des tiers sans le consentement explicite de l'utilisateur. Elle sont conserver uniquement le temps nécessaire à la gestion des licences.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-black text-[16px] mb-2">Cookies</h2>
          <p>Cette application n’utilise pas de cookies ou technologies similaires.</p>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-black text-[16px] mb-2">Modification des mentions légales</h2>
          <p>
            [Suivis des notes] se réserve le droit de modifier à tout moment les présentes mentions légales. Il est conseillé à l’utilisateur de les consulter régulièrement.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-bold text-black text-[16px] mb-2">Contact</h2>
          <p>Pour toute question concernant ces mentions légales, merci de nous contacter à : [<a href="mailto:suivisdesnotes@gmail.com" className="text-blue-600 underline">
              suivisdesnotes@gmail.com
            </a>]</p>
        </section>
      </main>
    </div>
  );
};

