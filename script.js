const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const menuLabel = menuButton?.querySelector(".sr-only");

function closeMenu() {
  if (!menuButton || !navigation) return;

  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  if (menuLabel) {
    menuLabel.textContent = "Ouvrir le menu";
  }
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);

    if (menuLabel) {
      menuLabel.textContent = isOpen ? "Ouvrir le menu" : "Fermer le menu";
    }
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      closeMenu();
    }
  });
}

const year = document.querySelector("#current-year");

if (year) {
  year.textContent = new Date().getFullYear();
}
