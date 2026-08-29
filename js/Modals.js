// Closes any <dialog class="pillar-modal"> when the backdrop (not the
// content) is clicked. Escape and the Close button need no JS here —
// native <dialog> behavior and <form method="dialog"> already handle both.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('dialog.pillar-modal').forEach(dialog => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });
});
