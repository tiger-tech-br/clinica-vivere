
"use strict";

// CONFIGURAÇÕES
// Informe apenas um número autorizado, com DDI e DDD,
// por exemplo: 5511999999999.
// Enquanto estiver vazio, o agendamento permanece demonstrativo.
const WHATSAPP_NUMBER = "";

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const toast = document.querySelector(".toast");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

// MENU MOBILE
function closeMenu() {
  nav.classList.remove("open");
  menuButton.classList.remove("active");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}

menuButton.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuButton.classList.toggle("active", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Fechar menu" : "Abrir menu"
  );
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("click", event => {
  if (
    nav.classList.contains("open") &&
    !nav.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    closeMenu();
  }
});

// MENSAGENS DE INTERAÇÃO
let toastTimeout;

function showToast(message) {
  clearTimeout(toastTimeout);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

// AGENDAMENTO
function openWhatsApp(specialty = "") {
  const number = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!/^\d{10,15}$/.test(number)) {
    showToast(
      "Esta é uma demonstração. O agendamento ainda não está configurado."
    );
    return;
  }

  const message = specialty
    ? `Olá! Gostaria de informações sobre consultas de ${specialty}.`
    : "Olá! Gostaria de informações sobre o agendamento de uma consulta.";

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-whatsapp]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp();
  });
});

// ESPECIALIDADES
document.querySelectorAll("[data-specialty]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const specialty = link.dataset.specialty;

    // Se não houver contato configurado, mostra a demonstração.
    // Caso contrário, abre uma mensagem personalizada.
    openWhatsApp(specialty);
  });
});

// FAQ: apenas uma pergunta aberta por vez
const faqItems = document.querySelectorAll(".faq-items details");

faqItems.forEach(item => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;

    faqItems.forEach(other => {
      if (other !== item) {
        other.open = false;
      }
    });
  });
});

// ANIMAÇÕES DE ENTRADA
const animatedElements = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: "0px 0px 40px 0px"
  });

  animatedElements.forEach(element => observer.observe(element));
} else {
  animatedElements.forEach(element => {
    element.classList.add("visible");
  });
}
