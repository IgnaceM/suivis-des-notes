import { useEffect, useState } from "react";

function Loading({ duration = 5000 , message }) {

  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 3 secondes d’attente, puis démarrage du fade-out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration);

    // Après le fade-out (1s), on recharge la page


    return () => {
      clearTimeout(fadeTimer);
      
    };
  }, [duration]);


  return (
    <div>

      <div
        className={`fixed z-50 inset-0 flex flex-col items-center justify-center bg-black bg-opacity-20 text-white transition-opacity duration-1000 ${fadeOut ? "opacity-50" : "opacity-100"
          }`}
      >
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-[1px] "></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-sky-500 animate-spin"></div>
        </div>
        <p className="mt-6 text-md tracking-wider font-medium animate-pulse">
          
        </p>
      </div>

    </div>


  );
}



export default Loading;
