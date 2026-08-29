// Cinematic scroll-reveal — fades in .reveal elements as they enter view.
// Used only by wrc-cinematic.html. Does not affect main.js or any other page.
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
});
