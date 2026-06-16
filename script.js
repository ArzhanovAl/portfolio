const heroRoot = document.querySelector('[data-carousel="hero"]');
if (heroRoot) {
  const slides = [...heroRoot.querySelectorAll(".hero-slide")];
  const nextButton = heroRoot.querySelector("[data-next]");
  const prevButton = heroRoot.querySelector("[data-prev]");
  let active = 0;
  let timer;

  const showSlide = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === active);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(active + 1), 4200);
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
}

const workTrack = document.querySelector(".work-track");
document.querySelector("[data-scroll-left]")?.addEventListener("click", () => {
  workTrack?.scrollBy({ left: -360, behavior: "smooth" });
});
document.querySelector("[data-scroll-right]")?.addEventListener("click", () => {
  workTrack?.scrollBy({ left: 360, behavior: "smooth" });
});

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
