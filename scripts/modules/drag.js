export function initDrag() {
  let down = false;
  const origin = document.querySelector(".starfield-origin");

  if (!origin) return;

  origin.addEventListener("mousedown", () => {
    down = true;
  });

  window.addEventListener("mouseup", () => {
    down = false;
  });

  window.addEventListener("mousemove", (event) => {
    if (down) {
      origin.style.top = `${event.clientY}px`;
      origin.style.left = `${event.clientX}px`;
    }
  });
}
