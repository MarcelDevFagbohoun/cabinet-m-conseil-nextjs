// Préchargeur : balance de justice animée, SVG + CSS uniquement.
// Rendu dans le HTML initial (aucune requête). Se retire au `load` de la
// page (ou après un filet de sécurité), une fois par session, et ne
// s'affiche pas si l'utilisateur préfère les animations réduites.

const dismissScript = `(function(){try{
var p=document.getElementById('cmc-preloader');if(!p)return;
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var seen;try{seen=sessionStorage.getItem('cmc-pre')}catch(e){}
if(reduce||seen){p.classList.add('is-hidden');return}
try{sessionStorage.setItem('cmc-pre','1')}catch(e){}
var hide=function(){p.classList.add('is-hidden')};
window.addEventListener('load',function(){setTimeout(hide,350)});
setTimeout(hide,2200);
}catch(e){var q=document.getElementById('cmc-preloader');if(q)q.classList.add('is-hidden')}})();`;

export default function Preloader() {
  return (
    <>
      <div id="cmc-preloader" aria-hidden="true">
        <svg
          className="cmc-scale"
          viewBox="0 0 120 130"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* socle + mât */}
          <circle cx="60" cy="18" r="3.5" fill="currentColor" stroke="none" />
          <line x1="60" y1="21" x2="60" y2="104" />
          <path d="M49 104 h22 l-5 -8 h-12 z" fill="currentColor" stroke="none" />
          <line x1="40" y1="112" x2="80" y2="112" />

          {/* fléau + plateaux (partie animée) */}
          <g className="cmc-beam">
            <line x1="16" y1="31" x2="104" y2="31" />
            <circle cx="60" cy="31" r="3.5" fill="currentColor" stroke="none" />
            <g>
              <line x1="16" y1="31" x2="16" y2="46" />
              <path d="M3 46 H29 Q16 62 3 46 Z" />
            </g>
            <g>
              <line x1="104" y1="31" x2="104" y2="46" />
              <path d="M91 46 H117 Q104 62 91 46 Z" />
            </g>
          </g>
        </svg>
      </div>
      <script dangerouslySetInnerHTML={{ __html: dismissScript }} />
    </>
  );
}
