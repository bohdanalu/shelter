const burger = document.querySelector(".burger");
const menu = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav-item");
const body = document.querySelector("body");
const overlay = document.querySelector(".overlay");

burger.addEventListener("click", toggleMenu);
burger.addEventListener("click", toggleOverlay);
menu.addEventListener("click", clickOnMenu);

function toggleMenu() {
  burger.classList.toggle("_active");
  menu.classList.toggle("_active");
  body.classList.toggle("_lock");
}

function toggleOverlay() {
  if (burger.classList.contains("_active")) {
    overlay.style.display = "block";
  } else {
    overlay.style.display = "none";
  }
}

function clickOnMenu(event) {
  for (const item of navLinks) {
    if (event.target == item) {
      body.classList.remove("_lock");
      overlay.style.display = "none";
      burger.classList.remove("_active");
      menu.classList.remove("_active");
    }
  }
}
