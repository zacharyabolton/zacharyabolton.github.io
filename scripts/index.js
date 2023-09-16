document.addEventListener("DOMContentLoaded", function () {
  adjustLinksContainerAlignment();
  window.addEventListener("resize", adjustLinksContainerAlignment);
});

function adjustLinksContainerAlignment() {
  const container = document.getElementById("links-container");
  let childrenWidth = 0;

  for (let i = 0; i < container.children.length; i++) {
    childrenWidth += container.children[i].offsetWidth;
  }

  if (childrenWidth > container.offsetWidth) {
    container.style.justifyContent = "flex-start";
  } else {
    container.style.justifyContent = "center";
  }
}
