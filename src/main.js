import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './style.css'; // Certifique-se de que o nome do seu CSS está correto aqui

gsap.registerPlugin(ScrollTrigger);

// --- 1. PRELOADER ANIMADO ---
let progress = { value: 0 };
gsap.to(progress, {
  value: 100,
  duration: 2,
  ease: "power2.inOut",
  onUpdate: () => {
    document.querySelector(".counter").innerText = Math.round(progress.value) + "%";
  },
  onComplete: () => {
    gsap.to(".preloader", {
      y: "-100%",
      duration: 1,
      ease: "power3.inOut",
      delay: 0.2
    });
  }
});

// --- 2. CURSOR CUSTOMIZADO ---
const cursor = document.querySelector(".cursor");
const cursorText = document.querySelector(".cursor-text");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1, ease: "power2.out" });
});

const cards = document.querySelectorAll(".card");
cards.forEach(card => {
  card.addEventListener("mouseenter", () => {
    gsap.to(cursor, { scale: 4, backgroundColor: "#00ff88", duration: 0.3 });
    gsap.to(cursorText, { opacity: 1, duration: 0.3 });
    cursorText.innerText = "VER";
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(cursor, { scale: 1, backgroundColor: "#fff", duration: 0.3 });
    gsap.to(cursorText, { opacity: 0, duration: 0.3 });
    cursorText.innerText = "";
  });
});

// --- 3. BOTÕES MAGNÉTICOS ---
const magneticBtns = document.querySelectorAll(".magnetic-btn");
magneticBtns.forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.5, ease: "power2.out" });
  });
  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
  });
});

// --- 4. SCROLL NAS SEÇÕES BÁSICAS ---
gsap.from(".fade-text", {
  scrollTrigger: { trigger: ".scroll-section", start: "top 80%", toggleActions: "play none none reverse" },
  y: 50, opacity: 0, duration: 1, ease: "power2.out"
});

gsap.from(cards, {
  scrollTrigger: { trigger: ".scroll-section", start: "top 70%", toggleActions: "play none none reverse" },
  y: 100, opacity: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)"
});

// --- 5. EFEITO 3D E CLIQUE NOS CARDS (COM PROTEÇÃO MOBILE) ---
let activeCard = null;
const isDesktop = window.matchMedia("(any-hover: hover)").matches;

cards.forEach((card) => {
  if (isDesktop) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(card, { rotationX: (y / rect.height) * -30, rotationY: (x / rect.width) * 30, duration: 0.5 });
      const image = card.querySelector(".card-image");
      if(image) gsap.to(image, { x: (x / rect.width) * -20, y: (y / rect.height) * -20, duration: 0.5 });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5 });
      const imageOut = card.querySelector(".card-image");
      if(imageOut) gsap.to(imageOut, { x: 0, y: 0, duration: 0.5 });
    });
  }

  card.addEventListener("click", () => {
    if (activeCard === card) {
      gsap.to(card, { y: 0, scale: 1, boxShadow: "none", duration: 0.5 });
      gsap.to(cards, { opacity: 1, scale: 1, duration: 0.5 });
      activeCard = null;
    } else {
      if (activeCard) gsap.to(activeCard, { y: 0, scale: 1, boxShadow: "none", duration: 0.5 });
      const otherCards = Array.from(cards).filter(c => c !== card);
      gsap.to(otherCards, { opacity: 0.3, scale: 0.9, duration: 0.5 });
      gsap.to(card, { y: -20, scale: 1.05, boxShadow: "0px 20px 40px rgba(0, 255, 136, 0.4)", opacity: 1, duration: 0.5 });
      activeCard = card;
    }
  });
});

// --- 6. SCROLL HORIZONTAL ---
let horizontalContainer = document.querySelector(".horizontal-container");
if(horizontalContainer) {
  gsap.to(horizontalContainer, {
    x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-wrapper",
      pin: true,
      scrub: 1,
      end: () => "+=" + horizontalContainer.scrollWidth
    }
  });
}

// --- 7. ANIMAÇÕES NOVAS: PRODUTO E CONTATO ---
gsap.from(".product-content", {
  scrollTrigger: { trigger: ".product-section", start: "top 80%" },
  x: -100, opacity: 0, duration: 1.2, ease: "power3.out"
});

gsap.from(".product-image-wrapper", {
  scrollTrigger: { trigger: ".product-section", start: "top 80%" },
  x: 100, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.3
});

gsap.from(".contact-container", {
  scrollTrigger: { trigger: ".contact-section", start: "top 90%" },
  y: 50, opacity: 0, duration: 1, ease: "power3.out"
});