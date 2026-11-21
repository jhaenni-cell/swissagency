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
