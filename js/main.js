(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 이메일: 주소를 조각으로 나눠 두었다가 화면에서 조합합니다 (스팸 수집 방지)
  var USER = "npng8313";
  var DOMAIN = "gmail.com";
  var mail = USER + "@" + DOMAIN;
  document.querySelectorAll("[data-mail-link]").forEach(function (a) {
    a.setAttribute("href", "mailto:" + mail);
  });
  document.querySelectorAll("[data-mail-text]").forEach(function (el) {
    el.textContent = mail;
  });

  // 연도
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // 모바일 메뉴(햄버거)
  var btn = document.getElementById("menu-btn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }
  btn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  // 상단 바 그림자
  var bar = document.getElementById("topbar");
  function onScroll() { bar.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 숫자 올라가기
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduce || isNaN(target)) { el.textContent = target; return; }
    var start = null, dur = 900;
    el.textContent = "0";
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // 스크롤하면 서서히 나타나기
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("show"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("show");
      en.target.querySelectorAll("[data-count]").forEach(countUp);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  items.forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 80 + "ms";
    io.observe(el);
  });
})();
