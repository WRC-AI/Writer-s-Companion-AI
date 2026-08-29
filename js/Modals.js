// Closes any <dialog class="pillar-modal"> when the backdrop (not the
// content) is clicked. Escape and the Close button need no JS here —
// native <dialog> behavior and <form method="dialog"> already handle both.
//
// Also forces every modal to start scrolled to its own top when opened.
// Some mobile browsers can shift the initial scroll position toward
// whatever element receives focus when a dialog opens — this makes
// sure the operator always sees the first line first, regardless of
// what caused it to scroll otherwise.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('dialog.pillar-modal').forEach(dialog => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    const observer = new MutationObserver(() => {
      if (dialog.open) {
        dialog.scrollTop = 0;
      }
    });
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
});
