// ================= Stars =================
// A mix of pixel-square stars (retro) and soft round ones,
// concentrated in the upper (twilight) part of the sky.
const starField = document.getElementById("stars");
const prefersReduced = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function rand(min, max){ return Math.random() * (max - min) + min; }

function buildStars(){
  const count = window.innerWidth < 640 ? 46 : 90;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++){
    const s = document.createElement("span");
    const pixel = Math.random() < 0.4;
    s.className = "star " + (pixel ? "px" : "rd");
    const size = pixel ? (Math.random() < 0.5 ? 3 : 4) : rand(2, 4);
    s.style.width = s.style.height = size + "px";
    s.style.left = rand(0, 100) + "%";
    // bias toward the top 45% of the sky where it's darkest
    s.style.top = (Math.pow(Math.random(), 1.6) * 45) + "%";
    s.style.setProperty("--tw", rand(2.2, 5.5) + "s");
    s.style.setProperty("--td", rand(0, 5) + "s");
    frag.appendChild(s);
  }
  starField.replaceChildren(frag);
}
buildStars();

let resizeT;
window.addEventListener("resize", () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(buildStars, 300);
});

// ================= Shooting stars =================
function shoot(){
  if (prefersReduced) return;
  const s = document.createElement("span");
  s.className = "shoot";
  s.style.left = rand(45, 95) + "%";
  s.style.top = rand(4, 26) + "%";
  starField.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
}
if (!prefersReduced){
  setInterval(() => { if (Math.random() < 0.65) shoot(); }, 4200);
  setTimeout(shoot, 1600);
}

// ================= Scroll reveal =================
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !prefersReduced){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("in"));
}

// ================= Sun parallax on scroll =================
const sun = document.querySelector(".sun");
if (sun && !prefersReduced){
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY * 0.06, 80);
      sun.style.transform = `translateY(${y}px)`;
      ticking = false;
    });
  }, { passive: true });
}
