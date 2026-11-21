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

// Pricing buttons preselect the plan in the form
const planSelect = document.querySelector('select[name="plan"]');
document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    planSelect.value = btn.dataset.plan;
  })
);

// Reveal on scroll
const revealEls = document.querySelectorAll(".card, .step, .plan, .checklist li, .faq details, .section h2");
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
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Contact form → opens the visitor's email client with the details prefilled.
// Swap this for Formspree, Tally, Calendly, etc. when you have a backend.
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const body = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Brand: ${data.get("brand") || "-"}`,
    `Plan: ${data.get("plan")}`,
    `Content: ${data.get("link") || "-"}`,
  ].join("\n");
  const subject = `Clipping plan request — ${data.get("brand") || data.get("name")}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  e.target.querySelector(".form__note").textContent = "Thanks! Your email app should open now — just hit send.";
});
