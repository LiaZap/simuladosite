/* ============================================================
   Simulados PRF — interações da landing
   ============================================================ */
(function () {
  "use strict";

  /* ---------- FAQ acordeão ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var ans = item.querySelector(".faq-a");
    btn.addEventListener("click", function () {
      var open = item.getAttribute("aria-expanded") === "true";
      // fecha os outros
      document.querySelectorAll(".faq-item").forEach(function (other) {
        if (other !== item) {
          other.setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.setAttribute("aria-expanded", open ? "false" : "true");
      ans.style.maxHeight = open ? null : ans.scrollHeight + "px";
    });
  });

  /* ---------- Sticky CTA mobile: aparece depois do hero, some na oferta/rodapé ---------- */
  var sticky = document.getElementById("stickyCta");
  var hero = document.getElementById("topo");
  var offer = document.getElementById("oferta");
  function updateSticky() {
    if (window.innerWidth > 620) { sticky.classList.remove("show"); return; }
    var pastHero = window.scrollY > (hero ? hero.offsetHeight - 120 : 500);
    var offerTop = offer ? offer.getBoundingClientRect().top : 9999;
    var offerVisible = offerTop < window.innerHeight && offerTop > -offer.offsetHeight;
    sticky.classList.toggle("show", pastHero && !offerVisible);
  }
  window.addEventListener("scroll", updateSticky, { passive: true });
  window.addEventListener("resize", updateSticky);
  updateSticky();

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Countdown (placeholder — 48h rolling) ---------- */
  var KEY = "prf_deadline";
  var deadline = parseInt(localStorage.getItem(KEY) || "0", 10);
  var now = Date.now();
  if (!deadline || deadline < now) {
    deadline = now + 48 * 3600 * 1000; // 48h a partir de agora
    localStorage.setItem(KEY, String(deadline));
  }
  var elD = document.getElementById("cd-d"),
      elH = document.getElementById("cd-h"),
      elM = document.getElementById("cd-m"),
      elS = document.getElementById("cd-s");
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var diff = Math.max(0, deadline - Date.now());
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (elD) elD.textContent = pad(d);
    if (elH) elH.textContent = pad(h);
    if (elM) elM.textContent = pad(m);
    if (elS) elS.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Copiar cupom (helper) ---------- */
  function copyCode(code, btn) {
    var label = btn.textContent;
    function ok() {
      btn.textContent = "Copiado!";
      btn.classList.add("done");
      setTimeout(function () { btn.textContent = label; btn.classList.remove("done"); }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(ok).catch(ok);
    } else {
      var ta = document.createElement("textarea");
      ta.value = code; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); ok();
    }
  }

  /* ---------- Promo bar ---------- */
  var promobar = document.getElementById("promobar");
  var promoCopy = document.getElementById("promoCopy");
  var promoClose = document.getElementById("promoClose");
  if (promoCopy) promoCopy.addEventListener("click", function () { copyCode(promoCopy.getAttribute("data-code"), promoCopy); });
  if (promoClose) promoClose.addEventListener("click", function () { promobar.style.display = "none"; });

  /* ---------- Coupon modal ---------- */
  var modal = document.getElementById("couponModal");
  var modalClose = document.getElementById("couponClose");
  var couponCopy = document.getElementById("couponCopy");
  var couponContext = document.getElementById("couponContext");
  var planNames = { pacote: "Pacote completo", redacao: "Redacao PRF", simulados: "Simulados PRF" };
  var planLinks = {
    pacote: "https://pay.kiwify.com.br/hliZtSu",
    redacao: "https://pay.kiwify.com.br/clGdRqv",
    simulados: "https://pay.kiwify.com.br/hliZtSu"
  };
  var currentPlan = "pacote";

  function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
  function openModal(plan, price) {
    currentPlan = plan || "pacote";
    modal.classList.remove("mode-code", "mode-upsell");
    if (!plan || plan === "pacote") {
      modal.classList.add("mode-code");
      setText("couponKicker", "Desconto liberado");
      setText("couponTitle", "Você ganhou 20% OFF");
      setText("couponText", "Aplique o cupom abaixo na finalização e garanta o Pacote Completo com desconto.");
      if (couponContext) couponContext.innerHTML = "Plano: <b>Pacote completo</b>" + (price ? " — " + price : "");
    } else {
      modal.classList.add("mode-upsell");
      var name = planNames[plan] || "esse plano";
      setText("couponKicker", "Espere — tem oferta melhor");
      setText("couponTitle", "O cupom é só do Pacote Completo");
      setText("couponText", "O SIMULADOS20 vale exclusivamente para o Pacote Completo. Compare antes de decidir:");
      setText("upsellPlanName", name.toLowerCase());
      setText("upsellPlanName2", name.toLowerCase());
      if (price) setText("upsellPlanPrice", price);
    }
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-buy]").forEach(function (el) {
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      openModal(el.getAttribute("data-buy"), el.getAttribute("data-price"));
    });
  });
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  if (couponCopy) couponCopy.addEventListener("click", function () { copyCode(couponCopy.getAttribute("data-code"), couponCopy); });
  var upsellContinue = document.getElementById("upsellContinue");
  if (upsellContinue) upsellContinue.addEventListener("click", function () {
    var link = planLinks[currentPlan];
    if (link) window.location.href = link;
    else closeModal();
  });

  /* ---------- Popup do cupom: tempo na página + exit intent ---------- */
  var exitShown = false;
  try { exitShown = sessionStorage.getItem("prf_exit") === "1"; } catch (e) {}
  function fireOnce(variant) {
    if (exitShown || !modal) return;
    if (modal.classList.contains("show")) return; // já tem modal aberto
    exitShown = true;
    try { sessionStorage.setItem("prf_exit", "1"); } catch (e) {}
    modal.classList.remove("mode-upsell");
    modal.classList.add("mode-code");
    if (variant === "exit") {
      setText("couponKicker", "Antes de você ir");
      setText("couponTitle", "Leve 20% OFF antes de sair");
      setText("couponText", "Guardamos seu cupom. Use o código abaixo e garanta o Pacote Completo com desconto.");
    } else {
      setText("couponKicker", "Um empurrãozinho");
      setText("couponTitle", "Garanta 20% OFF agora");
      setText("couponText", "Liberamos seu cupom de desconto. Aplique o código abaixo e leve o Pacote Completo por menos.");
    }
    if (couponContext) couponContext.innerHTML = "Plano: <b>Pacote completo</b>";
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  // Tempo na página: 45s
  setTimeout(function () { fireOnce("timed"); }, 45000);
  // Trava: exit-intent só ativa após 10s na página (evita disparo ao entrar)
  var exitReady = false;
  setTimeout(function () { exitReady = true; }, 10000);
  // Desktop: cursor sai pelo topo da janela
  document.addEventListener("mouseout", function (e) {
    if (exitReady && e.clientY <= 0 && !e.relatedTarget) fireOnce("exit");
  });
  // Mobile: intercepta o botão "voltar" uma vez
  try { history.pushState({ prf: 1 }, ""); } catch (e) {}
  window.addEventListener("popstate", function () {
    if (exitReady && !exitShown) {
      fireOnce("exit");
      try { history.pushState({ prf: 1 }, ""); } catch (e) {}
    }
  });
})();
