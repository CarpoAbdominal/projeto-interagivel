import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- 0. PRELOADER (TELA DE CARREGAMENTO) ---
let count = 0;
const counterElement = document.querySelector(".counter");
// Impede a rolagem enquanto carrega
document.body.style.overflow = "hidden"; 

const updateCounter = setInterval(() => {
  count += Math.floor(Math.random() * 8) + 1; // Incrementa aleatoriamente rápido
  if (count > 100) count = 100;
  if (counterElement) counterElement.innerText = count + "%";
  
  if (count === 100) {
    clearInterval(updateCounter);
    
    // Anima a saída do preloader deslizando para cima
    gsap.to(".preloader", {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 0.3,
      onComplete: () => {
        document.body.style.overflow = "auto"; // Libera o scroll
        document.body.style.overflowX = "hidden"; // Mantém o X travado
      }
    });

    // Animações da tela inicial (só começam DEPOIS do loading)
    gsap.to(".box", {
      rotation: 360, duration: 2, repeat: -1, yoyo: true, ease: "power2.inOut", scale: 1.5, delay: 1
    });
    gsap.from(".logo", {
      opacity: 0, y: 50, duration: 1.5, ease: "power4.out", delay: 1.2
    });
  }
}, 30); // Velocidade do contador


// --- 1. CURSOR PERSONALIZADO ---
let xTo = gsap.quickTo(".cursor", "x", { duration: 0.15, ease: "power3" });
let yTo = gsap.quickTo(".cursor", "y", { duration: 0.15, ease: "power3" });

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX - 10); 
  yTo(e.clientY - 10);
});


// --- 2. LETREIRO INFINITO (MARQUEE) ---
gsap.to(".marquee-content", {
  xPercent: -50,
  ease: "none",
  duration: 10,
  repeat: -1
});


// --- 3. ANIMAÇÕES DE SCROLL (CARDS) ---
gsap.from(".fade-text", {
  scrollTrigger: { trigger: ".fade-text", start: "top 80%" },
  y: 50, opacity: 0, duration: 1.2, ease: "power3.out"
});

gsap.from(".card", {
  scrollTrigger: { trigger: ".cards-container", start: "top 75%" },
  y: 100, opacity: 0, duration: 1, stagger: 0.2, ease: "power4.out"
});


// --- 4. EFEITO 3D NOS CARDS E INTERAÇÃO DE CLIQUE (MOBILE FIRST) ---
const cards = document.querySelectorAll(".card");
let activeCard = null;

// A MÁGICA: Verifica se o dispositivo usa mouse (suporta "hover")
const isDesktop = window.matchMedia("(any-hover: hover)").matches;

cards.forEach((card) => {
  
  // 1. Efeitos de Mouse (Tilt) - SÓ RODA SE TIVER MOUSE (Desktop)
  if (isDesktop) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (y / rect.height) * -30;
      const rotateY = (x / rect.width) * 30;

      gsap.to(card, { rotationX: rotateX, rotationY: rotateY, duration: 0.5, ease: "power2.out" });

      const image = card.querySelector(".card-image");
      if(image) {
        gsap.to(image, { x: (x / rect.width) * -20, y: (y / rect.height) * -20, duration: 0.5, ease: "power2.out" });
      }
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: "power2.out" });
      const imageOut = card.querySelector(".card-image");
      if(imageOut) { gsap.to(imageOut, { x: 0, y: 0, duration: 0.5, ease: "power2.out" }); }
    });
  }

  // 2. Interação de Clique (Focus Mode) - RODA EM TODOS (Mobile e Desktop)
  card.addEventListener("click", () => {
    if (activeCard === card) {
      gsap.to(card, { y: 0, scale: 1, boxShadow: "none", duration: 0.5, ease: "back.out(1.7)" });
      gsap.to(cards, { opacity: 1, scale: 1, duration: 0.5 }); 
      activeCard = null;
    } else {
      if (activeCard) {
        gsap.to(activeCard, { y: 0, scale: 1, boxShadow: "none", duration: 0.5 });
      }
      
      const otherCards = Array.from(cards).filter(c => c !== card);
      gsap.to(otherCards, { opacity: 0.3, scale: 0.9, duration: 0.5, ease: "power2.out" });

      gsap.to(card, {
        y: -20, // Subindo um pouco menos no mobile para não cortar na tela
        scale: 1.05,
        boxShadow: "0px 20px 40px rgba(0, 255, 136, 0.4)",
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
      
      activeCard = card;
    }
  });
});
// --- 5. BOTÃO MAGNÉTICO ---
const magBtn = document.querySelector(".magnetic-btn");
const magText = document.querySelector(".btn-text");
if(magBtn && magText) {
  magBtn.addEventListener("mousemove", (e) => {
    const rect = magBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(magBtn, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: "power2.out" });
    gsap.to(magText, { x: x * 0.6, y: y * 0.6, duration: 0.3, ease: "power2.out" });
  });
  magBtn.addEventListener("mouseleave", () => {
    gsap.to([magBtn, magText], { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
  });
}


// --- 6. PINNING E SCROLL HORIZONTAL (COM CURSOR MUTANTE) ---
const horizontalContainer = document.querySelector(".horizontal-container");
const horizontalWrapper = document.querySelector(".horizontal-wrapper");
const cursorText = document.querySelector(".cursor-text");

if(horizontalContainer && horizontalWrapper) {
  gsap.to(horizontalContainer, {
    x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: horizontalWrapper,
      pin: true,
      start: "top top",
      end: () => "+=" + horizontalContainer.scrollWidth,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  // Cursor mutante nesta seção
  horizontalWrapper.addEventListener("mouseenter", () => {
    gsap.to(".cursor", { width: 100, height: 100, backgroundColor: "#00ff88", mixBlendMode: "normal", duration: 0.3 });
    if(cursorText) {
      cursorText.innerText = "SCROLL";
      gsap.to(cursorText, { opacity: 1, duration: 0.3, delay: 0.1 });
    }
  });
  horizontalWrapper.addEventListener("mouseleave", () => {
    gsap.to(".cursor", { width: 20, height: 20, backgroundColor: "#fff", mixBlendMode: "difference", duration: 0.3 });
    if(cursorText) { gsap.to(cursorText, { opacity: 0, duration: 0.1 }); }
  });
}


// --- 7. SHOWCASE DE PRODUTO (REVEAL ANIMATION) ---
// Anima os textos subindo suavemente
gsap.from(".reveal-text", {
  scrollTrigger: {
    trigger: ".product-showcase",
    start: "top 60%", // Começa quando o topo da seção atinge 60% da tela
  },
  y: 50,
  opacity: 0,
  duration: 1.2,
  stagger: 0.2, // Anima o H2 e depois o P
  ease: "power4.out"
});

// Efeito Parallax de escala na imagem (zoom out enquanto rola)
gsap.to(".product-image", {
  scrollTrigger: {
    trigger: ".product-showcase",
    start: "top bottom",
    end: "bottom top",
    scrub: 1 // Conecta à rodinha do mouse suavemente
  },
  scale: 1, // Volta do 1.3 pro 1.0 original
  ease: "none"
});

// --- 7. ANIMAÇÕES DE SCROLL: PRODUTO E CONTATO ---

// Animação da Seção de Produto (Texto vem da esquerda, Imagem da direita)
gsap.from(".product-content", {
  scrollTrigger: {
    trigger: ".product-section",
    start: "top 80%", // Inicia a animação quando a seção chegar em 80% da tela
  },
  x: -100, // Começa 100px para a esquerda
  opacity: 0,
  duration: 1.2,
  ease: "power3.out"
});

gsap.from(".product-image-wrapper", {
  scrollTrigger: {
    trigger: ".product-section",
    start: "top 80%",
  },
  x: 100, // Começa 100px para a direita
  opacity: 0,
  duration: 1.2,
  ease: "power3.out",
  delay: 0.3 // Um pequeno atraso para a imagem entrar logo depois do texto
});

// Animação da Seção de Contato / Footer (Sobe suavemente)
gsap.from(".contact-container", {
  scrollTrigger: {
    trigger: ".contact-section",
    start: "top 90%",
  },
  y: 50, // Começa 50px para baixo
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});