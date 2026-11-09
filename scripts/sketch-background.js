/* Fade on every visit, including pages restored from the back/forward cache. */
document.documentElement.classList.add("sketch-enter");
window.addEventListener("pageshow", (event) => {
  if (!event.persisted) return;
  document.documentElement.classList.remove("sketch-enter");
  void document.body.offsetWidth;
  document.documentElement.classList.add("sketch-enter");
});
