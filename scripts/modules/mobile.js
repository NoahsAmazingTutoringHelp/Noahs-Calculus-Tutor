export function initMobile() {
  function maybeMobile() {
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    if (window.innerWidth < 768) {
      return true;
    }
    if ("ontouchstart" in window || navigator.msMaxTouchPoints > 0) {
      return true;
    }
  }
  window.onload = function() {
    if (maybeMobile()) {
      const modal = document.getElementById("mobilePopup");
      modal.style.display = "block";
      const confirmButton = document.getElementById("confirmButton");
      confirmButton.onclick = function() {
        modal.style.display = "none";
      }
    }
  }
}
