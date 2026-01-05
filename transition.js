// ================================
// GLOBAL ELEMENTS
// ================================
const stairs = document.querySelectorAll(".step");
const loader = document.getElementById("loader");
const line = document.querySelector(".line-loader .line");
const page = document.getElementById("page");

// ================================
// INITIAL LOADER
// ================================
function animateLoader() {
  return gsap.timeline()
    .to(line, { width: "100%", duration: 2, ease: "power1.inOut" })
    .to(loader, {
      y: "-100%",
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => loader.remove()
    });
}

// ================================
// STAIR ANIMATION
// ================================
function stairsIn() {
  return gsap.to(stairs, {
    y: "0%",
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.inOut"
  });
}

function stairsOut() {
  return gsap.to(stairs, {
    y: "-100%",
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.inOut",
    onComplete: () => gsap.set(stairs, { y: "100%" })
  });
}

// ================================
// MENU INIT (BARBA SAFE)
// ================================
function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("fullscreenNav");
  if (!menuBtn || !nav) return;

  const newBtn = menuBtn.cloneNode(true);
  menuBtn.replaceWith(newBtn);

  newBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    newBtn.classList.toggle("active");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      newBtn.classList.remove("active");
    });
  });
}

// ================================
// HEADER SCROLL
// ================================
function initHeaderScroll() {
  const header = document.querySelector("header");
  const hero = document.querySelector(".hero");
  if (!header || !hero) return;

  let heroHeight = hero.offsetHeight;
  let lastScroll = 0;
  let heroPassed = false;

  function updateHeroHeight() {
    heroHeight = hero.offsetHeight;
  }

  function onScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    if (scrollY > heroHeight - 80) {
      header.classList.add("scrolled");
      heroPassed = true;
    } else {
      header.classList.remove("scrolled", "hide");
      heroPassed = false;
    }

    if (heroPassed) {
      if (scrollY > lastScroll && scrollY > heroHeight + 50) {
        header.classList.add("hide");
      } else {
        header.classList.remove("hide");
      }
    }

    lastScroll = scrollY;
  }

  window.removeEventListener("scroll", onScroll);
  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", updateHeroHeight);
  onScroll();
}

// ================================
// HERO GLIDE SLIDER (CRITICAL FIX)
// ================================
let heroGlide = null;

function initHeroSlider(container = document) {
  const heroEl = container.querySelector(".hero-glide");
  if (!heroEl) return;

  if (heroGlide) {
    heroGlide.destroy();
    heroGlide = null;
  }

  const images = heroEl.querySelectorAll("img");

  Promise.all(
    [...images].map(
      img =>
        img.complete ||
        new Promise(resolve => {
          img.onload = img.onerror = resolve;
        })
    )
  ).then(() => {
    heroGlide = new Glide(heroEl, {
      type: "carousel",
      perView: 1,
      autoplay: 4000,
      hoverpause: false,
      animationDuration: 1200
    });

    heroGlide.mount();

    // FORCE RECALCULATION (fix reload freeze)
    requestAnimationFrame(() => heroGlide.update());
  });
}

// ================================
// IMAGE SLIDERS (CONTENT)
// ================================
function initGlideSliders(container = document) {
  container.querySelectorAll(".image-slider-section").forEach(section => {
    const glideEl = section.querySelector(".glide");
    if (!glideEl) return;

    const slides = glideEl.querySelectorAll(".glide__slide").length;

    const glide = new Glide(glideEl, {
      type: "carousel",
      perView: 4,
      gap: 24,
      animationDuration: 700,
      breakpoints: {
        1200: { perView: 4 },
        992: { perView: 3 },
        576: { perView: 2 },
        0: { perView: 1 }
      }
    });

    glide.mount();

    const counter = section.querySelector(".counter-number");
    if (counter) counter.textContent = 1;

    glide.on("run", () => {
      if (counter) counter.textContent = (glide.index % slides) + 1;
    });

    section.querySelector(".slider-next")?.addEventListener("click", () => glide.go(">"));
    section.querySelector(".slider-prev")?.addEventListener("click", () => glide.go("<"));
  });
}

// ================================
// BARBA INIT (FULL FIX)
// ================================
barba.init({
  transitions: [
    {
      name: "stairs-transition",

      async once({ next }) {
        gsap.set(page, { opacity: 0 });
        await animateLoader();
        gsap.to(page, { opacity: 1, duration: 0.4 });

        initMenu();
        initHeaderScroll();

        requestAnimationFrame(() => {
          initHeroSlider(next.container);
          initGlideSliders(next.container);
        });
      },

      async leave({ current }) {
        document.getElementById("fullscreenNav")?.classList.remove("active");
        document.getElementById("menuBtn")?.classList.remove("active");

        await stairsIn();
        await gsap.to(current.container, { opacity: 0, duration: 0.1 });
      },

      async enter({ next }) {
        gsap.set(next.container, { opacity: 0 });

        initMenu();
        initHeaderScroll();
        initHeroSlider(next.container);
        initGlideSliders(next.container);

        await stairsOut();
        gsap.to(next.container, { opacity: 1, duration: 0.4 });
      }
    }
  ]
});

// ================================
// AFTER ENTER (SAFETY)
// ================================
barba.hooks.afterEnter(({ next }) => {
  initMenu();
  initHeaderScroll();
  initHeroSlider(next.container);
});
