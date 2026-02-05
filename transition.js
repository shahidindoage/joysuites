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

  if (hero || listingHero) {
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
      header.style.backgroundColor = ""; // reset color when at top
    }
  } 
  // If no hero/listingHero, always apply "scrolled" style
  else {
    header.classList.add("scrolled");
    headerContent.style.borderBottom = "none";
    headerContent.style.paddingTop = "15px";
    header.style.backgroundColor = "#204b59"; // <-- default green
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
  const heroEl = container.querySelector(".js-hero-glide");
  if (!heroEl) return;

  // Destroy previous instance if exists
  if (heroGlide) heroGlide.destroy();

  // Wait for images to load
  const images = heroEl.querySelectorAll("img");
  Promise.all([...images].map(img => img.complete || new Promise(r => { img.onload = img.onerror = r; })))
    .then(() => {
      heroGlide = new Glide(heroEl, {
        type: "carousel",
        perView: 1,
        gap: 0,
        autoplay: 3500,
        hoverpause: false,
        animationDuration: 1200,
        rewind: true
      });
      heroGlide.mount();
    });
}



// ================================
// IMAGE SLIDERS (CONTENT)
// ================================
// function initGlideSliders(container = document) {
//   container.querySelectorAll(".image-slider-section").forEach(section => {
//     const glideEl = section.querySelector(".glide");
//     if (!glideEl) return;

//     const slides = glideEl.querySelectorAll(".glide__slide").length;
//     const glide = new Glide(glideEl, {
//       type: "carousel",
//       perView: 4,
//       gap: 24,
//       animationDuration: 700,
//       breakpoints: {
//         1200: { perView: 4 },
//         992: { perView: 3 },
//         576: { perView: 2 },
//         0: { perView: 1 }
//       }
//     });

//     glide.mount();

//     const counter = section.querySelector(".counter-number");
//     if (counter) counter.textContent = 1;

//     glide.on("run", () => { if (counter) counter.textContent = (glide.index % slides) + 1; });

//     section.querySelector(".slider-next")?.addEventListener("click", () => glide.go(">"));
//     section.querySelector(".slider-prev")?.addEventListener("click", () => glide.go("<"));
//   });
// }
function initGlideSliders(container = document) {
  container.querySelectorAll(".image-slider-section").forEach(section => {
    const glideEl = section.querySelector(".glide");
    if (!glideEl) return;

    const slides = glideEl.querySelectorAll(".glide__slide").length;

    const glide = new Glide(glideEl, {
      type: "carousel",
      perView: 1,          // ✅ one image at a time
      gap: 0,              // ✅ full screen width
      focusAt: "center",
      animationDuration: 700
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

function initInteractiveElements(container = document) {
  // -----------------------------
  // 1. Thumbnail -> Main Image
  // -----------------------------
  const mainImage = container.querySelector("#mainImage");
  const thumbs = container.querySelectorAll(".thumb");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      if(mainImage) mainImage.src = thumb.src;

      thumbs.forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });

    // Optional: hover scale effect
    thumb.addEventListener("mouseenter", () => {
      thumb.style.transform = "scale(1.05)";
      thumb.style.transition = "transform 0.3s ease";
    });
    thumb.addEventListener("mouseleave", () => {
      thumb.style.transform = "scale(1)";
    });
  });

  // -----------------------------
  // 2. Tabs
  // -----------------------------
  const tabs = container.querySelectorAll(".nav a");
  const contents = container.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", e => {
      e.preventDefault();
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach(section => {
        section.classList.remove("active");
        if (section.dataset.content === target) {
          section.classList.add("active");
        }
      });

      const nav = container.querySelector(".nav");
      if (nav) {
        window.scrollTo({
          top: nav.offsetTop + 40,
          behavior: "smooth"
        });
      }
    });
  });

  // -----------------------------
  // 3. FAQ Accordion
  // -----------------------------
  const faqItems = container.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    if(question) {
      question.addEventListener("click", () => {
        faqItems.forEach(i => {
          if (i !== item) i.classList.remove("active");
        });

        item.classList.toggle("active");
      });
    }
  });

  // -----------------------------
  // 4. Spec Gallery Hover (image scale)
  // -----------------------------
  const specImages = container.querySelectorAll(".spec-row img");
  specImages.forEach(img => {
    img.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.05)";
      img.style.transition = "transform 0.5s ease";
    });
    img.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)";
    });
  });
}

function initMobileBar() {
  const links = document.querySelectorAll('.mobile-bottom-bar a');
  if (!links.length) return;

  const currentPath = window.location.pathname.replace(/\/$/, "");

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "");

    // reset
    link.classList.remove("active");

    // match current URL
    if (linkPath === currentPath) {
      link.classList.add("active");
    }

    // bind click once
    if (!link.dataset.bound) {
      link.addEventListener("click", () => {
        links.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
      link.dataset.bound = "true";
    }
  });
}

// ================================
// HERO CTA SMOOTH SCROLL (BARBA SAFE)
// ================================
function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * eased);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

function initHeroCta(container = document) {
  const btn = container.querySelector("#nextSectionBtn");
  const overlay = container.querySelector(".js-hero-overlay");
  if (!btn || !overlay) return;

  // Remove any previous listeners safely
  const newBtn = btn.cloneNode(true);
  btn.replaceWith(newBtn);

  newBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const heroSection = overlay.closest("section");
    const nextSection = heroSection ? heroSection.nextElementSibling : null;
    if (!nextSection) return;

    const targetY = nextSection.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(targetY, 1400);
  });
}
function showPopup() {
  const popup = document.getElementById("popup");
  if (!popup) return;

  // Show popup with animation
  popup.classList.add("active");
}

function closePopup() {
  const popup = document.getElementById("popup");
  if (!popup) return;

  // Hide popup with transition
  popup.classList.remove("active");
}

function triggerPopup(delay = 10000) {
  setTimeout(showPopup, delay);
}

// ================================
// TESTIMONIAL GLIDE SLIDER (NO CUT, BARBA SAFE)
// ================================
let testimonialGlide = null;

function initTestimonialGlide(container = document) {
  const glideEl = container.querySelector(".testimonial-glide");
  if (!glideEl) return;

  if (testimonialGlide) {
    testimonialGlide.destroy();
    testimonialGlide = null;
  }

  testimonialGlide = new Glide(glideEl, {
    type: "carousel",
    perView: 3,        // ✅ desktop 4
    gap: 15,
    animationDuration: 700,
    rewind: false,
    bound: true,      // ✅ prevents cut / overflow
    peek: 0,          // ✅ no partial slide
    autoplay: false,
    hoverpause: false,
    breakpoints: {
      1024: { perView: 3 },
      768: {
        perView: 1,   // ✅ mobile full width
        gap: 10
      }
    }
  });

  testimonialGlide.mount();

  const nextBtn = container.querySelector("#nextBtn");
  const prevBtn = container.querySelector("#prevBtn");

  nextBtn?.addEventListener("click", () => testimonialGlide.go(">"));
  prevBtn?.addEventListener("click", () => testimonialGlide.go("<"));
}

// ================================
// EXPERIENCE GLIDE SLIDER (BARBA SAFE)
// ================================
let experienceGlide = null;

function initExperienceGlide(container = document) {
  const glideEl = container.querySelector(".experience-glide");
  if (!glideEl) return;

  // Destroy previous instance
  if (experienceGlide) {
    experienceGlide.destroy();
    experienceGlide = null;
  }

  // Wait for images & layout
  const images = glideEl.querySelectorAll("img");
  Promise.all([...images].map(img => img.complete || new Promise(r => {
    img.onload = img.onerror = r;
  }))).then(() => {

    experienceGlide = new Glide(glideEl, {
      type: "carousel",
      startAt: 0,
      perView: 2,            // ✅ desktop = 2
      gap: 30,
      animationDuration: 700,
      animationTimingFunc: "ease-in-out",
      rewind: false,
      bound: true,          // ✅ no cut
      peek: 0,              // ✅ no partial slide
      autoplay: false,
      hoverpause: false,
      breakpoints: {
        1024: {
          perView: 2,
          gap: 20
        },
        768: {
          perView: 1,       // ✅ mobile = 1 full width
          gap: 0
        }
      }
    });

    experienceGlide.mount();

    // External arrows (BARBA SAFE)
    const nextBtn = container.querySelector("#next");
    const prevBtn = container.querySelector("#prev");

    if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));
    if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));

    const newNext = container.querySelector("#next");
    const newPrev = container.querySelector("#prev");

    newNext?.addEventListener("click", () => experienceGlide.go(">"));
    newPrev?.addEventListener("click", () => experienceGlide.go("<"));
  });
}

let videoTestimonialGlide = null;

function initVideoTestimonialGlide(container = document) {
  const glideEl = container.querySelector(".video-testimonial-glide");
  if (!glideEl) return;

  if (videoTestimonialGlide) {
    videoTestimonialGlide.destroy();
    videoTestimonialGlide = null;
  }

  videoTestimonialGlide = new Glide(glideEl, {
    type: "carousel",
    perView: 3,
    gap: 30,
    bound: true,
    rewind: false,
    autoplay: false,
    hoverpause: false,
    animationDuration: 700,
    breakpoints: {
      1024: { perView: 2, gap: 20 },
      768: { perView: 1, gap: 10 }
    }
  });

  videoTestimonialGlide.mount();

  const nextBtn = container.querySelector("#videoNext");
  const prevBtn = container.querySelector("#videoPrev");

  nextBtn?.addEventListener("click", () => videoTestimonialGlide.go(">"));
  prevBtn?.addEventListener("click", () => videoTestimonialGlide.go("<"));
}


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
       initTestimonialGlide(next.container);
       initExperienceGlide(next.container);
       initVideoTestimonialGlide(next.container);
        initRoomsFilter(next.container);
        initHeroCta(next.container);
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
initTestimonialGlide(next.container);
initExperienceGlide(next.container);
initVideoTestimonialGlide(next.container);
      initRoomsFilter(next.container);
      initHeroCta(next.container);
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
  initInteractiveElements(next.container); // <-- ADD THIS
  initMobileBar();
  showPopupOnce();
  initTestimonialGlide(next.container);
  initExperienceGlide(next.container);
  initVideoTestimonialGlide(next.container);
  initRoomsFilter(next.container);
  initHeroCta(next.container);
});

// ================================
// INITIAL LOAD
// ================================
document.addEventListener("DOMContentLoaded", () => {
  updateHeroRefs(document);
  handleHeaderScroll();
   initInteractiveElements(document);
   initMobileBar();
    triggerPopup(10000);
  initTestimonialSlider(document);
});

// ================================
// LISTING FILTER (BARBA SAFE)
// ================================
function initRoomsFilter(container = document) {

  const search = container.querySelector("#jsySearch");
  const location = container.querySelector("#jsyLocation");
  const rooms = container.querySelector("#jsyRooms");
  const baths = container.querySelector("#jsyBaths");
  const cards = container.querySelectorAll(".jsy-listing-card");

  // If page has no listing, stop safely
  if (!search || !location || !rooms || !baths || !cards.length) return;

  function filterCards() {
    const s = search.value.toLowerCase();
    const l = location.value;
    const r = rooms.value;
    const b = baths.value;

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();

      const show =
        text.includes(s) &&
        (l === "all" || card.dataset.location === l) &&
        (r === "all" || card.dataset.rooms === r) &&
        (b === "all" || card.dataset.baths === b);

      card.style.display = show ? "" : "none";
    });
  }

  search.addEventListener("keyup", filterCards);
  location.addEventListener("change", filterCards);
  rooms.addEventListener("change", filterCards);
  baths.addEventListener("change", filterCards);
}
  document.querySelectorAll('.nav-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const menu = document.getElementById(targetId);

      // close others
      document.querySelectorAll('.dropdown-menu').forEach(d => {
        if (d !== menu) d.classList.remove('active');
      });
      document.querySelectorAll('.nav-toggle').forEach(t => {
        if (t !== toggle) t.classList.remove('active');
      });

      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });
  });

  // click outside close
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item')) {
      document.querySelectorAll('.dropdown-menu').forEach(d => d.classList.remove('active'));
      document.querySelectorAll('.nav-toggle').forEach(t => t.classList.remove('active'));
    }
  });

