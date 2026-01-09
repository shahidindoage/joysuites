// // ================================
// // HEADER + HERO STATE
// // ================================
// let header = null;
// let headerContent = null;
// let hero = null;
// let listingHero = null;

// let isScrolled = false;
// let lastScroll = 0;

// // ================================
// // UPDATE HERO REFERENCES (BARBA SAFE)
// // ================================
// function updateHeroRefs(container = document) {
//   header = document.querySelector('header');
//   headerContent = document.querySelector('.header-content');

//   hero = container.querySelector('.hero');
//   listingHero = container.querySelector('.listing-hero');

//   // Reset state on page change
//   isScrolled = false;
//   lastScroll = 0;
// }

// // ================================
// // SCROLL TRIGGER HEIGHT
// // ================================
// function getTriggerHeight() {
//   // Listing hero → change background earlier
//   if (listingHero) {
//     return listingHero.offsetHeight * 0.35;
//   }

//   // Home hero → normal behavior
//   if (hero) {
//     return hero.offsetHeight - 50;
//   }

//   // Fallback
//   return 100;
// }

// // ================================
// // HEADER STYLE SWITCH
// // ================================
// function handleHeaderScroll() {
//   if (!header || !headerContent) return;

//   const scrollY = window.scrollY;
//   const triggerHeight = getTriggerHeight();

//   if (scrollY > triggerHeight && !isScrolled) {
//     isScrolled = true;
//     header.classList.add('scrolled');
//     header.classList.remove('hide');
//     headerContent.style.borderBottom = 'none';
//     headerContent.style.paddingTop = '15px';
//   }

//   if (scrollY <= triggerHeight && isScrolled) {
//     isScrolled = false;
//     header.classList.remove('scrolled', 'hide');
//     headerContent.style.paddingTop = '15px';
//   }
// }

// // ================================
// // HIDE / SHOW ON SCROLL DIRECTION
// // ================================
// window.addEventListener('scroll', () => {
//   if (!header) return;

//   const currentScroll = window.scrollY;
//   const triggerHeight = getTriggerHeight();

//   // Hide on scroll down
//   if (currentScroll > lastScroll && currentScroll > triggerHeight + 40) {
//     header.classList.add('hide');
//   } 
//   // Show on scroll up
//   else {
//     header.classList.remove('hide');
//   }

//   lastScroll = currentScroll;
//   handleHeaderScroll();
// });

// // ================================
// // LENIS SUPPORT
// // ================================
// if (window.lenis) {
//   lenis.on('scroll', () => {
//     handleHeaderScroll();
//   });
// }

// // ================================
// // BARBA HOOK (CRITICAL)
// // ================================
// barba.hooks.afterEnter(({ next }) => {
//   updateHeroRefs(next.container);
//   handleHeaderScroll();
// });

// // ================================
// // INITIAL LOAD
// // ================================
// document.addEventListener('DOMContentLoaded', () => {
//   updateHeroRefs(document);
//   handleHeaderScroll();
// });
