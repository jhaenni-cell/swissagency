// Contact address for form submissions — replace with your real inbox.
const CONTACT_EMAIL = "hello@swissclips.ch";

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav__links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Subtle reveal on scroll
const revealEls = document.querySelectorAll(".section__head, .card, .steps li, .list li, .faq details, .table-wrap");
revealEls.forEach((el) => el.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Contact form → opens the visitor's email client with the details prefilled.
// Swap for Formspree, Tally or Calendly when ready.
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const body = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Company: ${data.get("brand") || "-"}`,
    `Content: ${data.get("link") || "-"}`,
    `Goal: ${data.get("goal") || "-"}`,
  ].join("\n");
  const subject = `Free clips request — ${data.get("brand") || data.get("name")}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  e.target.querySelector(".form__note").textContent = "Thanks! Your email app should open now. Just hit send.";
});

/* =========================================================
   Motion
   ========================================================= */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = (n) => Math.round(n).toLocaleString("en-US");

// Run a callback when an element enters / leaves the viewport
function onView(el, enter, leave, threshold = 0.3) {
  if (!el || !("IntersectionObserver" in window)) { enter && enter(); return; }
  new IntersectionObserver((entries) =>
    entries.forEach((e) => (e.isIntersecting ? enter && enter() : leave && leave())),
    { threshold }
  ).observe(el);
}

// Count up a number element
function countUp(el, to, ms = 1600) {
  const start = performance.now();
  const step = (t) => {
    const p = Math.min((t - start) / ms, 1);
    el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- Hero phone: auto-swiping feed with animated captions ---------- */
(function phoneFeed() {
  const track = document.querySelector(".feed__track");
  if (!track) return;
  const CLIP_MS = 3400;
  const clips = [...track.children];

  // Split captions into words for karaoke-style subtitles
  clips.forEach((clip) => {
    const cap = clip.querySelector(".clip__caption");
    cap.innerHTML = cap.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    clip.style.setProperty("--clip-ms", CLIP_MS + "ms");
  });

  // Clone first clip for a seamless loop
  const clone = clips[0].cloneNode(true);
  track.appendChild(clone);
  const all = [...track.children];

  let index = 0;
  let wordTimer;

  function activate(i) {
    all.forEach((c) => c.classList.remove("is-active"));
    const clip = all[i];
    // restart progress animation
    const bar = clip.querySelector(".clip__progress span");
    bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
    clip.classList.add("is-active");

    const words = [...clip.querySelectorAll(".w")];
    words.forEach((w) => w.classList.remove("on", "hot"));
    clearInterval(wordTimer);
    let k = 0;
    const per = Math.min(320, (CLIP_MS - 900) / words.length);
    wordTimer = setInterval(() => {
      words.forEach((w) => w.classList.remove("hot"));
      if (k < words.length) { words[k].classList.add("on", "hot"); k++; }
      else clearInterval(wordTimer);
    }, per);
  }

  function next() {
    index++;
    track.style.transform = `translateY(-${index * 100}%)`;
    activate(index);
    if (index === all.length - 1) {
      setTimeout(() => {
        track.classList.add("no-anim");
        index = 0;
        track.style.transform = "translateY(0)";
        void track.offsetWidth;
        track.classList.remove("no-anim");
        activate(0);
      }, 750);
    }
  }

  activate(0);
  if (reduceMotion) { all[0].querySelectorAll(".w").forEach((w) => w.classList.add("on")); return; }
  setInterval(next, CLIP_MS);
})();

/* ---------- Hero: live views ticker + notifications ---------- */
(function heroFloats() {
  const ticker = document.getElementById("views-ticker");
  const notif = document.getElementById("notif");
  if (!ticker || reduceMotion) return;

  let views = 184320;
  setInterval(() => {
    views += 40 + Math.random() * 260;
    ticker.textContent = fmt(views);
  }, 900);

  const msgs = [
    ["New follower", "just now"],
    ["Clip shared 1.2K times", "2 min ago"],
    ["+318 profile visits", "today"],
    ["New inquiry via website", "just now"],
    ["Clip trending on Reels", "5 min ago"],
  ];
  let m = 0;
  const title = document.getElementById("notif-title");
  const sub = document.getElementById("notif-sub");
  setInterval(() => {
    notif.classList.add("is-hidden");
    setTimeout(() => {
      m = (m + 1) % msgs.length;
      title.textContent = msgs[m][0];
      sub.textContent = msgs[m][1];
      notif.classList.remove("is-hidden");
    }, 450);
  }, 3200);
})();

/* ---------- Stat bar counters ---------- */
document.querySelectorAll(".bar .count").forEach((el) => {
  let done = false;
  onView(el, () => { if (!done && !reduceMotion) { done = true; countUp(el, +el.dataset.to, 1400); } });
});

/* ---------- Explainer flow ----------
   Desktop: the three steps play in sequence and loop while visible.
   Mobile (stacked): each step plays when it scrolls into view. */
(function flow() {
  const flowEl = document.getElementById("flow");
  if (!flowEl) return;
  const nums = flowEl.querySelectorAll(".platform__num");
  if (reduceMotion) { nums.forEach((n) => (n.textContent = fmt(+n.dataset.to))); return; }

  const stacked = window.matchMedia("(max-width: 960px)").matches;
  let timers = [];

  function restart(el, numDelay) {
    if (el === flowEl) { timers.forEach(clearTimeout); timers = []; }
    el.classList.remove("is-playing");
    el.querySelectorAll(".platform__num").forEach((n) => (n.textContent = "0"));
    void el.offsetWidth;
    el.classList.add("is-playing");
    el.querySelectorAll(".platform__num").forEach((n, i) =>
      timers.push(setTimeout(() => countUp(n, +n.dataset.to, 2000), numDelay + i * 200)));
  }

  if (stacked) {
    flowEl.querySelectorAll(".flow__col").forEach((col) =>
      onView(col, () => { if (!col.classList.contains("is-playing")) restart(col, 200); }, null, 0.5));
    return;
  }

  let loop;
  onView(flowEl,
    () => { if (!loop) { restart(flowEl, 6000); loop = setInterval(() => restart(flowEl, 6000), 11000); } },
    () => { clearInterval(loop); loop = null; },
    0.35
  );
})();
