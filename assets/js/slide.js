(function () {
  const track = document.getElementById("imgTrack");
  const dotsWrap = document.getElementById("imgDots");

  if (!track || !dotsWrap) {
    console.error("Elementos do carrossel não encontrados");
    return;
  }

  let slides = Array.from(track.children);

  if (slides.length === 0) {
    console.error("Nenhum slide encontrado");
    return;
  }

  // 🔥 CLONES (loop infinito)
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = Array.from(track.children);
  const totalSlides = slides.length;
  const realSlidesCount = totalSlides - 2;

  let index = 1; // Começa no primeiro slide real (após o clone)
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let autoSlideInterval;
  const autoSlideDelay = 4000; // 4 segundos

  // ===== FUNÇÃO PARA OBTER LARGURA DO SLIDE =====
  function getSlideWidth() {
    return slides[0]?.clientWidth || 0;
  }

  // ===== UPDATE POSIÇÃO =====
  function update(animate = true) {
    const slideWidth = getSlideWidth();
    if (slideWidth === 0) return;

    currentTranslate = -index * slideWidth;
    prevTranslate = currentTranslate;

    track.style.transition = animate
      ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none";
    track.style.transform = `translateX(${currentTranslate}px)`;

    updateDots();
  }

  // ===== CONSTRUIR DOTS =====
  function buildDots() {
    dotsWrap.innerHTML = "";

    for (let i = 0; i < realSlidesCount; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      dot.setAttribute("data-index", i);
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        index = i + 1;
        update(true);
        resetAutoSlide();
      });
      dotsWrap.appendChild(dot);
    }
  }

  // ===== ATUALIZAR DOTS =====
  function updateDots() {
    const dots = document.querySelectorAll("#imgDots .dot");
    if (dots.length === 0) return;

    let realIndex = index - 1;

    // Ajustar índice quando estiver nos clones
    if (realIndex < 0) realIndex = realSlidesCount - 1;
    if (realIndex >= realSlidesCount) realIndex = 0;

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === realIndex);
    });
  }

  // ===== CORREÇÃO DO LOOP INFINITO =====
  track.addEventListener("transitionend", () => {
    const slideWidth = getSlideWidth();
    if (slideWidth === 0) return;

    // Se chegou no último clone (que é igual ao primeiro)
    if (index === totalSlides - 1) {
      index = 1;
      track.style.transition = "none";
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      // Forçar reflow
      void track.offsetHeight;
      updateDots();
    }

    // Se chegou no primeiro clone (que é igual ao último)
    if (index === 0) {
      index = totalSlides - 2;
      track.style.transition = "none";
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      // Forçar reflow
      void track.offsetHeight;
      updateDots();
    }
  });

  // ===== DRAG FUNCTIONS =====
  function startDrag(x) {
    isDragging = true;
    startX = x;
    track.style.transition = "none";
    stopAutoSlide();
  }

  function drag(x) {
    if (!isDragging) return;
    const diff = x - startX;
    const slideWidth = getSlideWidth();
    if (slideWidth === 0) return;

    track.style.transform = `translateX(${prevTranslate + diff}px)`;
  }

  function endDrag(x) {
    if (!isDragging) return;
    isDragging = false;

    const diff = x - startX;
    const threshold = 50; // Sensibilidade para trocar slide

    if (diff < -threshold) {
      // Arrastou para esquerda -> próximo slide
      index++;
    } else if (diff > threshold) {
      // Arrastou para direita -> slide anterior
      index--;
    }

    update(true);
    resetAutoSlide();
  }

  // ===== AUTO SLIDE =====
  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      if (!isDragging) {
        index++;
        update(true);
      }
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // ===== EVENTOS DE MOUSE (DESKTOP) =====
  track.addEventListener("mousedown", (e) => {
    e.preventDefault();
    startDrag(e.clientX);
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      e.preventDefault();
      drag(e.clientX);
    }
  });

  window.addEventListener("mouseup", (e) => {
    if (isDragging) {
      endDrag(e.clientX);
    }
  });

  // ===== EVENTOS DE TOUCH (MOBILE) =====
  track.addEventListener("touchstart", (e) => {
    startDrag(e.touches[0].clientX);
  });

  track.addEventListener(
    "touchmove",
    (e) => {
      if (isDragging) {
        e.preventDefault();
        drag(e.touches[0].clientX);
      }
    },
    { passive: false },
  );

  track.addEventListener("touchend", (e) => {
    if (isDragging) {
      endDrag(e.changedTouches[0].clientX);
    }
  });

  // ===== PREVENIR DRAG EM IMAGENS =====
  const images = track.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("dragstart", (e) => e.preventDefault());
  });

  // ===== RESPONSIVIDADE: RECALCULAR AO REDIMENSIONAR =====
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const slideWidth = getSlideWidth();
      if (slideWidth > 0) {
        track.style.transition = "none";
        track.style.transform = `translateX(-${index * slideWidth}px)`;
        prevTranslate = -index * slideWidth;
        currentTranslate = prevTranslate;
      }
    }, 100);
  });

  // ===== PAUSAR AUTO SLIDE AO PASSAR O MOUSE =====
  const carouselContainer = track.parentElement;
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", () => {
      stopAutoSlide();
    });

    carouselContainer.addEventListener("mouseleave", () => {
      startAutoSlide();
    });
  }

  // ===== INICIALIZAR =====
  buildDots();
  update(false);
  startAutoSlide();
})();
