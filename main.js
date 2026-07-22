// ---- Ubah kalimat semangat di sini ----
const messages = [
  "Aku tahu belakangan ini nggak selalu mudah buat kamu. Tapi aku lihat, kamu tetap bangun setiap pagi buat nyoba lagi❤️.",
  "Nggak apa-apa kalau hari ini terasa berat. Kamu nggak harus selalu kuat di setiap detik — cukup terus melangkah, sekecil apa pun langkahnya.",
  "Banyak yang bangga sama kamu. Bukan cuma karena hasil yang kamu capai, tapi karena cara kmu terus mencoba meski capek.",
  "Heii kamu jauh lebih kuat dari yang kamu kira, dan jauh lebih berharga dari yang kamu sadari😉.",
  "Istirahat sebentar itu bukan nyerah yaa. yang kamu butuhin cuma jeda, bukan berhenti sama sekali okeyyy👌.",
  "Terus berjalan, ya. Pelan-pelan juga nggak masalah, yang penting kamu nggak berhenti percaya sama dirimu sendiri okey?✌️.",
  "Makasih ya udah jadi ruang paling tenang pas duniaku lagi berisik banget🩶.",
];

const notesContainer = document.getElementById("notesContainer");
messages.forEach((text) => {
  const div = document.createElement("div");
  div.className = "note";

  const mark = document.createElement("span");
  mark.className = "note-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = "❝";

  const p = document.createElement("p");
  p.textContent = text;

  div.appendChild(mark);
  div.appendChild(p);
  notesContainer.appendChild(div);
});

// ================= MUSIK ROMANTIS (file MP3 kustom) =================
const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 1.0; // atur volume 0.0 (hening) - 1.0 (paling keras)

const musicToggle = document.getElementById("musicToggle");
let musicOn = false;

function startMusic() {
  bgMusic.currentTime = 0;
  const playPromise = bgMusic.play();
  if (playPromise) {
    playPromise.catch(() => {
      // Browser sempat memblokir autoplay (jarang terjadi karena ini
      // dipicu langsung dari klik amplop). Coba lagi saat toggle diklik.
    });
  }
  musicOn = true;
  musicToggle.classList.add("playing");
  musicToggle.setAttribute("aria-pressed", "true");
  musicToggle.setAttribute("aria-label", "Matikan musik");
}

function stopMusic() {
  bgMusic.pause();
  musicOn = false;
  musicToggle.classList.remove("playing");
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.setAttribute("aria-label", "Aktifkan musik");
}

musicToggle.addEventListener("click", () => {
  if (musicOn) stopMusic();
  else startMusic();
});

// ================= PARTIKEL AMBIEN ================
const ambientLayer = document.getElementById("ambientLayer");
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const AMBIENT_GLYPHS = ["♥", "♥", "♥", "✦", "♪"];
const AMBIENT_COLORS = [
  "var(--rose)",
  "var(--rose-deep)",
  "var(--lavender-deep)",
  "var(--gold)",
];
let ambientCount = 0;
const AMBIENT_MAX = 14;

function spawnPetal() {
  if (reduceMotion || document.hidden || ambientCount >= AMBIENT_MAX) {
    return;
  }
  const span = document.createElement("span");
  span.className = "petal";
  span.textContent =
    AMBIENT_GLYPHS[Math.floor(Math.random() * AMBIENT_GLYPHS.length)];
  span.style.left = Math.random() * 100 + "%";
  span.style.color =
    AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)];
  span.style.fontSize = 12 + Math.random() * 12 + "px";
  span.style.animationDuration = 9 + Math.random() * 7 + "s";
  span.style.setProperty("--sway", Math.random() * 80 - 40 + "px");
  ambientLayer.appendChild(span);
  ambientCount++;
  span.addEventListener("animationend", () => {
    span.remove();
    ambientCount--;
  });
}

if (!reduceMotion) {
  // Ledakan kecil partikel di awal biar kesan pertama lebih hidup
  for (let i = 0; i < 6; i++) {
    setTimeout(spawnPetal, 150 + i * 220);
  }
  setInterval(spawnPetal, 1500);
}

// ================= PROGRESS BACA ================
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");

function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct =
    docHeight > 0
      ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      : 0;
  progressFill.style.width = pct + "%";
  if (!reduceMotion) {
    ambientLayer.style.transform = "translateY(" + scrollTop * 0.04 + "px)";
  }
}
window.addEventListener("scroll", updateProgress, { passive: true });

// ---- Buka amplop ----
const envelopeBtn = document.getElementById("envelopeBtn");
const cover = document.getElementById("cover");
const content = document.getElementById("content");

envelopeBtn.addEventListener("click", () => {
  envelopeBtn.classList.add("open");
  envelopeBtn.disabled = true;
  startMusic(); // musik mulai bareng surat dibuka
  spawnHeartBurst(10, 50, 30); // hati beterbangan saat surat dibuka
  setTimeout(() => {
    cover.style.opacity = "0";
  }, 220);
  setTimeout(() => {
    cover.style.display = "none";
    content.classList.add("visible");
    content.removeAttribute("aria-hidden");
    window.scrollTo({ top: 0 });
    progressBar.classList.add("visible");
    musicToggle.classList.add("visible");
    updateProgress();
  }, 650);
});

// ---- Reveal elemen saat discroll (catatan, divider, intro, penutup) ----
const revealTargets = document.querySelectorAll(
  ".note, .divider, .closing, .intro-line",
);
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 },
  );
  revealTargets.forEach((n) => observer.observe(n));
} else {
  revealTargets.forEach((n) => n.classList.add("in-view"));
}

const heartBtn = document.getElementById("heartBtn");
const heartsLayer = document.getElementById("heartsLayer");
const thanksNote = document.getElementById("thanksNote");

function spawnHeartBurst(count = 8, centerPct = 50, spreadPct = 24) {
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "floating-heart";
    span.textContent = "♥";
    span.style.left =
      centerPct - spreadPct / 2 + Math.random() * spreadPct + "%";
    span.style.animationDelay = i * 0.1 + "s";
    span.style.setProperty("--drift", Math.random() * 60 - 30 + "px");
    heartsLayer.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  }
}

heartBtn.addEventListener("click", () => {
  heartBtn.classList.add("clicked");
  spawnHeartBurst(8, 50, 24);
  thanksNote.hidden = false;
});
