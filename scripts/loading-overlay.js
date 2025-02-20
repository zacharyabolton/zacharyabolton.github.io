// Script: loading-overlay.js
// Base function for removing overlay
function removeLoadingOverlay() {
  const overlay = document.querySelector(".loading-overlay");
  if (overlay) {
    overlay.classList.add("fade-out");
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }
}

// Determine which page we're on and use appropriate loading strategy
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
  // Check if we're on the index page (has P5.js)
  const isIndexPage = document.getElementById("animation-container") !== null;

  if (isIndexPage) {
    // For index.html - expose function for P5.js to call
    window.removeLoadingOverlay = removeLoadingOverlay;

    // Fallback for index page
    setTimeout(() => {
      if (document.querySelector(".loading-overlay")) {
        removeLoadingOverlay();
      }
    }, 500);
  } else {
    // For about-me.html - wait for images and remove overlay
    Promise.all(
      Array.from(document.images).map((img) => {
        console.log(img);
        if (img.complete) {
          return Promise.resolve();
        } else {
          console.log("Image not loaded");
        }
        return new Promise((resolve) => img.addEventListener("load", resolve));
      }),
    ).then(() => {
      removeLoadingOverlay();
    });
  }
});
