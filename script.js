(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // nav: scrolled state + mobile menu
  const nav = $("#nav"),
    menu = $("#menu");
  addEventListener("scroll", () => nav.classList.toggle("s", scrollY > 30), {
    passive: true,
  });
  nav.addEventListener("pointermove", (e) => {
    const r = nav.getBoundingClientRect();
    nav.style.setProperty("--mx", e.clientX - r.left + "px");
  });
  $("#burger").addEventListener("click", () => menu.classList.toggle("open"));
  $$("#menu a").forEach((a) =>
    a.addEventListener("click", () => menu.classList.remove("open")),
  );

  // reveal on scroll
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15 },
  );
  $$(".reveal").forEach((el) => io.observe(el));

  // count-up stats
  const co = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target,
          to = +el.dataset.to,
          suf = el.dataset.suf || "",
          t0 = performance.now();
        const tick = (t) => {
          const p = Math.min((t - t0) / 1400, 1);
          el.textContent =
            Math.round(to * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suf : "");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      }),
    { threshold: 0.6 },
  );
  $$("[data-to]").forEach((el) => co.observe(el));

  // card spotlight
  $$(".card").forEach((c) =>
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--x", e.clientX - r.left + "px");
      c.style.setProperty("--y", e.clientY - r.top + "px");
    }),
  );

  // light / dark toggle
  const root = document.documentElement;
  $("#theme").addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
  });

  // footer year
  $("#yr").textContent = new Date().getFullYear();
})();
