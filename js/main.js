/* ==========================================================================
   FRANCO SÁNCHEZ - PRESS KIT
   Este archivo hace tres cosas:
     1. Carga los VIDEOS de YouTube
     2. Carga las tarjetas de CANALES (productoras)
     3. Hace funcionar el CARRUSEL de fotos
   Lo único que normalmente vas a editar son las listas VIDEOS y CANALES.
   ========================================================================== */


/* ==========================================================================
   1. VIDEOS
   --------------------------------------------------------------------------
   CÓMO AGREGAR UN VIDEO:
     1. Copiá el link del video de YouTube. Por ejemplo:
          https://www.youtube.com/shorts/ddVLRmnK3dw
          https://www.youtube.com/watch?v=abc123XYZ_0
          https://youtu.be/abc123XYZ_0
     2. Copiá solo el CÓDIGO del final (los 11 caracteres):
          ddVLRmnK3dw
     3. Agregalo a la lista de abajo, entre comillas y con coma al final.
   Para quitar un video, borrá su línea.
   ========================================================================== */
const VIDEOS = [
  'ddVLRmnK3dw',   // Short 1
  'ulpDMl9_QSM',   // Short 2
  // 'CODIGO_DEL_VIDEO',   // <- ejemplo: sacá las // y poné el código
];

/**
 * Dibuja cada video de la lista dentro de #videos-grid.
 * Primero se muestra la miniatura con un botón play; el reproductor de
 * YouTube se carga recién al tocarla (la página queda más rápida).
 */
function renderVideos() {
  const grid = document.getElementById('videos-grid');

  // YouTube (error 153) no reproduce videos embebidos si la página se abre
  // con doble clic en index.html (dirección file://). En ese caso, al tocar
  // la miniatura se abre YouTube en otra pestaña.
  // Con Live Server o GitHub Pages el video se reproduce dentro de la página.
  const abiertoComoArchivo = window.location.protocol === 'file:';

  VIDEOS.forEach((id) => {
    const item = document.createElement('div');
    const urlYoutube = `https://www.youtube.com/watch?v=${id}`;

    item.innerHTML = `
      <div class="video__frame">
        <button class="video__cover" type="button" aria-label="Reproducir video">
          <img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="Miniatura del video" loading="lazy">
        </button>
      </div>
      <a class="video__link" href="${urlYoutube}" target="_blank" rel="noopener">Ver en YouTube</a>
    `;

    const frame = item.querySelector('.video__frame');

    item.querySelector('.video__cover').addEventListener('click', () => {
      if (abiertoComoArchivo) {
        window.open(urlYoutube, '_blank', 'noopener');
        return;
      }

      // Reemplaza la miniatura por el reproductor de YouTube
      frame.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1"
          title="Video de Franco Sánchez"
          allow="autoplay; accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      `;
    });

    grid.appendChild(item);
  });
}


/* ==========================================================================
   2. CANALES (productoras que subieron sets o temas de Franco)
   --------------------------------------------------------------------------
   CÓMO AGREGAR O COMPLETAR UNO:
     - nombre: el nombre del canal o productora
     - link:   la dirección del canal o del set. Si todavía no la tenés,
               dejala vacía ('') y la tarjeta dice "Link próximamente".
   ========================================================================== */
const CANALES = [
  { nombre: 'Natural Swing', link: '' },
  { nombre: 'Black Beat',    link: '' },
  { nombre: 'B2B Sessions',  link: '' },
  { nombre: 'One More',      link: '' },
];

/** Dibuja cada tarjeta de la lista dentro de #canales-grid */
function renderCanales() {
  const grid = document.getElementById('canales-grid');

  grid.innerHTML = CANALES.map((canal) => {
    // Contenido que comparten las dos versiones de tarjeta
    const contenido = `
      <strong>${canal.nombre}</strong>
      <span>Sets y producciones de Franco en su canal.</span>
    `;

    // Con link: tarjeta clickeable. Sin link: tarjeta informativa.
    if (canal.link) {
      return `<a class="card" href="${canal.link}" target="_blank" rel="noopener">${contenido}<em>Escuchar</em></a>`;
    }
    return `<div class="card">${contenido}<em>Link próximamente</em></div>`;
  }).join('');
}


/* ==========================================================================
   3. CARRUSEL DE FOTOS
   --------------------------------------------------------------------------
   No hace falta tocar nada acá: al agregar un <figure> nuevo en index.html,
   el carrusel crea solo el puntito y lo incluye.
   ========================================================================== */
function initCarousel() {
  const track   = document.getElementById('carousel-track');
  const dotsBox = document.getElementById('carousel-dots');
  const slides  = track.querySelectorAll('.carousel__slide');

  // Si el usuario pidió menos animaciones, el desplazamiento es instantáneo
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const behavior = reduceMotion ? 'auto' : 'smooth';

  /** Índice de la foto que se está viendo */
  const current = () => Math.round(track.scrollLeft / track.clientWidth);

  /** Va a la foto número i (si se pasa del final, vuelve al principio) */
  function goTo(i) {
    const total = slides.length;
    const index = (i + total) % total;
    track.scrollTo({ left: index * track.clientWidth, behavior });
  }

  // Crear un puntito por cada foto
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel__dot';
    dot.setAttribute('aria-label', `Ir a la foto ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });

  /** Marca el puntito de la foto actual */
  function updateDots() {
    const active = current();
    Array.from(dotsBox.children).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === active);
    });
  }

  // Botones anterior / siguiente
  document.getElementById('carousel-prev').addEventListener('click', () => goTo(current() - 1));
  document.getElementById('carousel-next').addEventListener('click', () => goTo(current() + 1));

  // Actualizar puntitos al deslizar y al iniciar
  track.addEventListener('scroll', updateDots, { passive: true });
  updateDots();
}


/* ==========================================================================
   INICIO: ejecuta todo cuando la página terminó de cargar
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  renderVideos();
  renderCanales();
  initCarousel();
});
