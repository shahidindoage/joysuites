// ================================
// GLOBAL ELEMENTS
// ================================
let stairs = null;
let loader = document.getElementById("loader");
let line = document.querySelector(".line-loader .line");
let page = document.getElementById("page");

// ================================
// HEADER + HERO STATE
// ================================
let header = null;
let headerContent = null;
let hero = null;
let listingHero = null;

let isScrolled = false;
let lastScroll = 0;

// ================================
// UPDATE HERO REFERENCES (BARBA SAFE)
// ================================
function updateHeroRefs(container = document) {
  header = document.querySelector("header");
  headerContent = document.querySelector(".header-content");

  hero = container.querySelector(".hero");
  listingHero = container.querySelector(".listing-hero");

  // Reset state on page change
  isScrolled = false;
  lastScroll = 0;
}

// ================================
// SCROLL TRIGGER HEIGHT
// ================================
function getTriggerHeight() {
  if (listingHero) {
    const vhHeight = window.innerHeight * 0.75; // 75vh
    const minHeight = 480;
    const heroHeight = Math.max(vhHeight, minHeight);
    return heroHeight * 0.85; // trigger earlier for listing hero
  }

  if (hero) {
    return hero.offsetHeight - 50;
  }

  return 100;
}


// ================================
// HEADER STYLE SWITCH
// ================================
function handleHeaderScroll() {
  if (!header || !headerContent) return;

  const scrollY = window.scrollY;
  const triggerHeight = getTriggerHeight();

  if (scrollY > triggerHeight && !isScrolled) {
    isScrolled = true;
    header.classList.add("scrolled");
    header.classList.remove("hide");
    headerContent.style.borderBottom = "none";
    headerContent.style.paddingTop = "15px";
  }

  if (scrollY <= triggerHeight && isScrolled) {
    isScrolled = false;
    header.classList.remove("scrolled", "hide");
    headerContent.style.paddingTop = "15px";
  }
}

// ================================
// HIDE / SHOW ON SCROLL DIRECTION
// ================================
let ticking = false;
window.addEventListener("scroll", () => {
  if (!header) return;

  if (!ticking) {
    requestAnimationFrame(() => {
      const currentScroll = window.scrollY;
      const triggerHeight = getTriggerHeight();

      // hide on scroll down
      if (currentScroll > lastScroll && currentScroll > triggerHeight + 40) {
        header.classList.add("hide");
      } 
      // show on scroll up
      else {
        header.classList.remove("hide");
      }

      lastScroll = currentScroll;
      handleHeaderScroll();
      ticking = false;
    });
    ticking = true;
  }
});

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
      onComplete: () => {
        loader.remove();
        const overlay = document.getElementById("page-overlay");
        if (overlay) {
          overlay.style.pointerEvents = "none";
          overlay.style.opacity = "0";
        }
        document.body.style.overflow = "auto";
      }
    });
}

// ================================
// STAIR ANIMATION
// ================================
function stairsIn() {
  stairs = document.querySelectorAll(".step");
  if (!stairs) return;
  return gsap.to(stairs, { y: "0%", duration: 0.6, stagger: 0.1, ease: "power2.inOut" });
}

function stairsOut() {
  stairs = document.querySelectorAll(".step");
  if (!stairs) return;
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

  const mainMenu = nav.querySelector(".menu-main");
  const subMenus = nav.querySelectorAll(".menu-sub");

  newBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    newBtn.classList.toggle("active");

    mainMenu.classList.add("active");
    mainMenu.classList.remove("slide-left");
    subMenus.forEach(m => m.classList.remove("active"));
  });

  nav.querySelectorAll(".open-submenu").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();

      const target = nav.querySelector(`#${link.dataset.target}`);
      mainMenu.classList.remove("active");
      mainMenu.classList.add("slide-left");
      subMenus.forEach(m => m.classList.remove("active"));
      target.classList.add("active");
    });
  });

  nav.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      subMenus.forEach(m => m.classList.remove("active"));
      mainMenu.classList.add("active");
      mainMenu.classList.remove("slide-left");
    });
  });

  nav.querySelectorAll("a:not(.open-submenu)").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      newBtn.classList.remove("active");
    });
  });
}

// ================================
// HERO GLIDE SLIDER
// ================================
let heroGlide = null;
function initHeroSlider(container = document) {
  const heroEl = container.querySelector(".hero-glide");
  if (!heroEl) return;

  if (heroGlide) heroGlide.destroy();

  const images = heroEl.querySelectorAll("img");
  Promise.all([...images].map(img => img.complete || new Promise(r => { img.onload = img.onerror = r; })))
    .then(() => {
      heroGlide = new Glide(heroEl, {
        type: "carousel",
        perView: 1,
        autoplay: 4000,
        hoverpause: false,
        animationDuration: 1200
      });
      heroGlide.mount();
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

    glide.on("run", () => { if (counter) counter.textContent = (glide.index % slides) + 1; });

    section.querySelector(".slider-next")?.addEventListener("click", () => glide.go(">"));
    section.querySelector(".slider-prev")?.addEventListener("click", () => glide.go("<"));
  });
}

// ================================
// BARBA INIT
// ================================
barba.init({
  transitions: [{
    name: "stairs-transition",
    async once({ next }) {
      gsap.set(page, { opacity: 0 });
      await animateLoader();
      gsap.to(page, { opacity: 1, duration: 0.4 });

      initMenu();
      updateHeroRefs(next.container);
      handleHeaderScroll();
      initHeroSlider(next.container);
      initGlideSliders(next.container);
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
      updateHeroRefs(next.container);
      handleHeaderScroll();
      initHeroSlider(next.container);
      initGlideSliders(next.container);

      await stairsOut();
      gsap.to(next.container, { opacity: 1, duration: 0.4 });
    }
  }]
});

// ================================
// BARBA AFTER ENTER
// ================================
barba.hooks.afterEnter(({ next }) => {
  updateHeroRefs(next.container);
  handleHeaderScroll();
  initHeroSlider(next.container);
  initGlideSliders(next.container);
});

// ================================
// INITIAL LOAD
// ================================
document.addEventListener("DOMContentLoaded", () => {
  updateHeroRefs(document);
  handleHeaderScroll();
});
