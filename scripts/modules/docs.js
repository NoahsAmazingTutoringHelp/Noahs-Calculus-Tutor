export function initDocs() {
  const openButton = document.getElementById("open-docs");
  const closeButton = document.getElementById("close-docs");
  const overlay = document.getElementById("documentation-overlay");

  if (!openButton || !closeButton || !overlay) return;

  openButton.addEventListener("click", () => {
    overlay.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === this) {
      this.style.display = "none";
    }
  });
}
