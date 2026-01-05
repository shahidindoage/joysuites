const header = document.querySelector('header');
const headerContent = document.querySelector('.header-content');
const hero = document.querySelector('.hero');
let isScrolled = false;

function handleHeaderScroll() {
  const scrollY = window.scrollY;
  const heroHeight = hero.offsetHeight - 50; // trigger a bit before hero ends

  if (scrollY > heroHeight && !isScrolled) {
    isScrolled = true;
    header.classList.add('scrolled');
    header.classList.remove('hide');
    headerContent.style.borderBottom = 'none'; // remove border
    headerContent.style.paddingTop="15px";
  } else if (scrollY <= heroHeight && isScrolled) {
    isScrolled = false;
    header.classList.remove('scrolled');
    header.classList.remove('hide');
    headerContent.style.paddingTop="15px";
    // headerContent.style.borderBottom = '1px solid rgba(255,255,255,0.4)'; // restore border
  }
}

// Hide header on scroll down (optional smooth hide before slide down)
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > hero.offsetHeight) {
    // scrolling down
    header.classList.add('hide');
  } else {
    // scrolling up
    header.classList.remove('hide');
  }

  lastScroll = currentScroll;
  handleHeaderScroll();
});

// If using Lenis smooth scroll
if (window.lenis) {
  lenis.on('scroll', () => handleHeaderScroll());
}

// Initial check on load
handleHeaderScroll();
