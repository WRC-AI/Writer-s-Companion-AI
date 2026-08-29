// Cinematic scroll-reveal — fades in .reveal elements as they enter view.
// Fail-safe by design: elements are visible by default (see .reveal in
// style.css). This script only makes them fade in — it never makes
// content depend on JS to be seen at all. If this script fails to
// load or run for any reason, everything remains simply visible.
document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  targets.forEach(el => el.classList.add('js-ready'));

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
