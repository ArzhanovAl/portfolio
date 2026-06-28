const heroRoot = document.querySelector('[data-carousel="hero"]');
if (heroRoot) {
  const slides = [...heroRoot.querySelectorAll(".hero-slide")];
  const nextButton = heroRoot.querySelector("[data-next]");
  const prevButton = heroRoot.querySelector("[data-prev]");
  const dotsRoot = document.createElement("div");
  let active = 0;
  let timer;

  dotsRoot.className = "hero-dots";
  dotsRoot.setAttribute("aria-label", "Слайды на главном экране");
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "hero-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Показать работу ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restart();
    });
    dotsRoot.append(dot);
  });
  heroRoot.append(dotsRoot);
  const dots = [...dotsRoot.querySelectorAll(".hero-dot")];

  const showSlide = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === active);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(active + 1), 2200);
  };

  nextButton?.addEventListener("click", () => {
    showSlide(active + 1);
    restart();
  });

  prevButton?.addEventListener("click", () => {
    showSlide(active - 1);
    restart();
  });

  restart();
  showSlide(0);
}

// ── Бесконечная карусель работ ──────────────────────────────────────
const workTrack = document.querySelector(".work-track");
const arrowLeft  = document.querySelector("[data-scroll-left]");
const arrowRight = document.querySelector("[data-scroll-right]");

if (workTrack) {
  // 1. Клонируем все карточки: вставляем копии в начало и конец
  const origCards = [...workTrack.querySelectorAll(".work-card")];
  const count = origCards.length;

  // Клоны в конец (для прокрутки вправо за последний)
  origCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.clone = "after";
    workTrack.append(clone);
  });

  // Клоны в начало (для прокрутки влево за первый)
  [...origCards].reverse().forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.dataset.clone = "before";
    workTrack.prepend(clone);
  });

  // Переподвешиваем обработчики галереи на клоны
  const reattachGallery = () => {
    workTrack.querySelectorAll("[data-gallery]").forEach((button) => {
      button.addEventListener("click", () => {
        const gallery = galleries[button.dataset.gallery];
        if (!gallery || !galleryModal || !galleryTitle || !galleryGrid) return;
        galleryTitle.textContent = gallery.title;
        galleryGrid.innerHTML = gallery.items.map(([src, label]) => `
          <figure>
            <img src="${src}" alt="${gallery.title}: ${label}">
            <figcaption>${label}</figcaption>
          </figure>
        `).join("");
        galleryModal.classList.add("is-open");
        galleryModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });
  };

  const getCardWidth = () => {
    const card = workTrack.querySelector(".work-card");
    if (!card) return 320;
    return card.offsetWidth + parseInt(getComputedStyle(workTrack).columnGap || getComputedStyle(workTrack).gap || "20");
  };

  // 2. Стартовая позиция — начало оригинальных карточек (после клонов-before)
  const jumpToStart = () => {
    workTrack.style.scrollBehavior = "auto";
    workTrack.scrollLeft = getCardWidth() * count;
    workTrack.style.scrollBehavior = "";
  };

  jumpToStart();
  window.addEventListener("resize", jumpToStart);

  let isScrolling = false;

  const slide = (direction) => {
    if (isScrolling) return;
    isScrolling = true;

    const step = getCardWidth();
    workTrack.style.scrollBehavior = "smooth";
    workTrack.scrollLeft += step * direction;

    // После анимации (~380ms) проверяем: не вышли ли за пределы оригинала
    setTimeout(() => {
      workTrack.style.scrollBehavior = "auto";

      const cw = getCardWidth();
      const minBound = cw * 1;           // левее 1-й клон
      const maxBound = cw * (count + count - 1); // правее последнего оригинала

      if (workTrack.scrollLeft < minBound) {
        // Перепрыгнуть с тихим скроллом к концу оригинальных
        workTrack.scrollLeft += cw * count;
      } else if (workTrack.scrollLeft > maxBound) {
        workTrack.scrollLeft -= cw * count;
      }

      workTrack.style.scrollBehavior = "";
      isScrolling = false;
    }, 420);
  };

  arrowLeft?.addEventListener("click",  () => slide(-1));
  arrowRight?.addEventListener("click", () => slide(1));

  // Переподвесить галерею после добавления клонов
  reattachGallery();
}

const galleries = {
  serum: {
    title: "Сыворотка против акне",
    items: [
      ["assets/serum-1.jpg", "Главная карточка"],
      ["assets/serum-2.jpg", "Инфографика"],
      ["assets/serum-3.jpg", "Дополнительная карточка"],
    ],
  },
  bag: {
    title: "Сумка",
    items: [
      ["assets/bag-hero.jpg", "Главная карточка"],
      ["assets/bag-2.jpg", "Инфографика"],
      ["assets/bag-3.jpg", "Дополнительная карточка"],
    ],
  },
  casio: {
    title: "Часы CASIO",
    items: [
      ["assets/casio-1.jpg", "Главная карточка"],
      ["assets/casio-2.jpg", "Инфографика"],
      ["assets/casio-3.jpg", "Дополнительная карточка"],
    ],
  },
  basket: {
    title: "Набор корзин",
    items: [
      ["assets/basket-1.jpg", "Главная карточка"],
      ["assets/basket-2.jpg", "Инфографика"],
      ["assets/basket-3.jpg", "Дополнительная карточка"],
    ],
  },
  kodalife: {
    title: "KODALIFE",
    items: [
      ["assets/kodalife-main.jpg", "Главная карточка"],
      ["assets/kodalife-info.jpg", "Инфографика"],
      ["assets/kodalife-card.jpg", "Преимущества"],
    ],
  },
  wae: {
    title: "WAE",
    items: [
      ["assets/wae-1.jpg", "Материал"],
      ["assets/wae-2.jpg", "Имиджевая карточка"],
      ["assets/wae-3.jpg", "Трендовая подача"],
    ],
  },
  labbra: {
    title: "LABBRA",
    items: [
      ["assets/labbra-1.jpg", "Главная карточка"],
      ["assets/labbra-2.jpg", "Имидж"],
      ["assets/labbra-3.jpg", "Размер и комплект"],
      ["assets/labbra-4.jpg", "Характеристики"],
    ],
  },
  marshall: {
    title: "Marshall",
    items: [
      ["assets/marshall-1.jpg", "Главная карточка"],
      ["assets/marshall-2.jpg", "Характеристики"],
    ],
  },
};

const galleryModal = document.querySelector("#galleryModal");
const galleryTitle = document.querySelector("#galleryTitle");
const galleryGrid = document.querySelector("#galleryGrid");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = imageLightbox?.querySelector("img");

const closeGallery = () => {
  galleryModal?.classList.remove("is-open");
  galleryModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const openLightbox = (image) => {
  if (!imageLightbox || !lightboxImage) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Работа в портфолио";
  imageLightbox.classList.add("is-open");
  imageLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  imageLightbox?.classList.remove("is-open");
  imageLightbox?.setAttribute("aria-hidden", "true");
  if (lightboxImage) {
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }

  if (!galleryModal?.classList.contains("is-open")) {
    document.body.style.overflow = "";
  }
};

document.querySelectorAll(".hero-slide img, .body-showcase img, .case-strip img").forEach((image) => {
  image.addEventListener("click", (event) => {
    event.stopPropagation();
    openLightbox(image);
  });
});

document.querySelectorAll("[data-gallery]").forEach((button) => {
  button.addEventListener("click", () => {
    const gallery = galleries[button.dataset.gallery];
    if (!gallery || !galleryModal || !galleryTitle || !galleryGrid) return;

    galleryTitle.textContent = gallery.title;
    galleryGrid.innerHTML = gallery.items.map(([src, label]) => `
      <figure>
        <img src="${src}" alt="${gallery.title}: ${label}">
        <figcaption>${label}</figcaption>
      </figure>
    `).join("");

    galleryModal.classList.add("is-open");
    galleryModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

document.querySelectorAll("[data-close-gallery]").forEach((button) => {
  button.addEventListener("click", closeGallery);
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (imageLightbox?.classList.contains("is-open")) {
    closeLightbox();
    return;
  }
  closeGallery();
});

galleryGrid?.addEventListener("click", (event) => {
  const image = event.target.closest?.("img");
  if (image) {
    event.stopPropagation();
    openLightbox(image);
  }
});

imageLightbox?.addEventListener("click", (event) => {
  if (event.target === imageLightbox || event.target.closest("[data-close-lightbox]")) {
    closeLightbox();
  }
});

const copyToast = document.querySelector("#copyToast");
let copyToastTimer;

const showCopyToast = () => {
  if (!copyToast) return;

  copyToast.classList.add("is-visible");
  window.clearTimeout(copyToastTimer);
  copyToastTimer = window.setTimeout(() => {
    copyToast.classList.remove("is-visible");
  }, 1800);
};

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  document.execCommand("copy");
  input.remove();
};

document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    await copyText(button.dataset.copyEmail);
    showCopyToast();
  });
});

const pageSections = [...document.querySelectorAll(".page-section")];
const railLinks = [...document.querySelectorAll("[data-rail]")];
const header = document.querySelector(".site-header");

const getHeaderOffset = () => Math.ceil(header?.getBoundingClientRect().height || 0);

const scrollToSection = (target) => {
  if (!target) return;

  const contentAnchor = target.querySelector(
    ":scope > .section-head, :scope > .about-copy, :scope > .contact-panel"
  ) || target;
  const visualGap = 26;
  const top = target.id === "top"
    ? 0
    : Math.max(0, contentAnchor.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - visualGap);

  window.scrollTo({ top, behavior: "smooth" });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href")?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    event.preventDefault();
    scrollToSection(target);
    history.pushState(null, "", `#${id}`);
    setActiveSection(target);
  });
});

window.addEventListener("load", () => {
  if (!window.location.hash) return;
  const target = document.getElementById(window.location.hash.slice(1));
  window.setTimeout(() => scrollToSection(target), 0);
});

const setActiveSection = (section) => {
  const id = section?.dataset.section;
  const tone = section?.dataset.tone || "hero";
  if (!id) return;

  document.body.dataset.tone = tone;
  section.querySelectorAll(".reveal").forEach((item) => {
    item.classList.add("is-visible");
  });
  document.documentElement.style.setProperty(
    "--scroll-progress",
    `${Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)}%`
  );

  railLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.rail === id);
  });
};

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.round((window.scrollY / maxScroll) * 100) : 0;
  document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);

  if (!pageSections.length) return;

  const viewportAnchor = window.innerHeight * 0.42;
  const current = pageSections.reduce((best, section) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top - viewportAnchor);
    return distance < best.distance ? { section, distance } : best;
  }, { section: pageSections[0], distance: Infinity }).section;

  setActiveSection(current);
};

if ("IntersectionObserver" in window && pageSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) setActiveSection(visible.target);
  }, {
    rootMargin: "-34% 0px -44% 0px",
    threshold: [0.12, 0.3, 0.55],
  });

  pageSections.forEach((section) => sectionObserver.observe(section));
  updateScrollState();
}

window.addEventListener("scroll", () => {
  updateScrollState();
}, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
