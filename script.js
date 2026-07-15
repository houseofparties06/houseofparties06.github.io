/* House Of Parties — site script (vanilla JS, no dependencies) */
(function(){
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  if(toggle){
    toggle.addEventListener("click", function(){
      document.body.classList.toggle("nav-open");
      var open = document.body.classList.contains("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".nav-links a").forEach(function(a){
      a.addEventListener("click", function(){ document.body.classList.remove("nav-open"); });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, {threshold:.12});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in"); });
  }

  /* FAQ accordion */
  document.querySelectorAll(".faq-item").forEach(function(item){
    var btn = item.querySelector(".faq-q");
    var ans = item.querySelector(".faq-a");
    if(!btn || !ans) return;
    btn.addEventListener("click", function(){
      var isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item.open").forEach(function(other){
        if(other !== item){ other.classList.remove("open"); other.querySelector(".faq-a").style.maxHeight = null; }
      });
      item.classList.toggle("open", !isOpen);
      ans.style.maxHeight = !isOpen ? ans.scrollHeight + "px" : null;
    });
  });

  /* Category tabs + search filter (rentals / sales pages) */
  var tabsWrap = document.querySelector("[data-tabs]");
  var cards = document.querySelectorAll("[data-cat]");
  if(tabsWrap && cards.length){
    var searchInput = document.querySelector("[data-search]");

    function applyFilter(){
      var activeTab = tabsWrap.querySelector(".tab-btn.active");
      var cat = activeTab ? activeTab.getAttribute("data-tab") : "all";
      var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
      cards.forEach(function(card){
        var matchesCat = cat === "all" || card.getAttribute("data-cat") === cat;
        var text = card.textContent.toLowerCase();
        var matchesSearch = !q || text.indexOf(q) !== -1;
        card.style.display = (matchesCat && matchesSearch) ? "" : "none";
      });
    }

    tabsWrap.querySelectorAll(".tab-btn").forEach(function(btn){
      btn.addEventListener("click", function(){
        tabsWrap.querySelectorAll(".tab-btn").forEach(function(b){ b.classList.remove("active"); });
        btn.classList.add("active");
        applyFilter();
      });
    });
    if(searchInput){ searchInput.addEventListener("input", applyFilter); }
    applyFilter();
  }

  /* Product detail modal */
  var modalBackdrop = document.querySelector("[data-modal]");
  if(modalBackdrop){
    var modalMediaImg = modalBackdrop.querySelector("[data-modal-img]");
    var modalTag = modalBackdrop.querySelector("[data-modal-tag]");
    var modalTitle = modalBackdrop.querySelector("[data-modal-title]");
    var modalDesc = modalBackdrop.querySelector("[data-modal-desc]");
    var modalAvail = modalBackdrop.querySelector("[data-modal-avail]");

    document.querySelectorAll("[data-open-modal]").forEach(function(trigger){
      trigger.addEventListener("click", function(){
        var card = trigger.closest(".card");
        if(!card) return;
        var img = card.querySelector("img");
        if(modalMediaImg && img){ modalMediaImg.src = img.src; modalMediaImg.alt = img.alt; }
        if(modalTag){ modalTag.textContent = card.getAttribute("data-cat-label") || ""; }
        if(modalTitle){ modalTitle.textContent = card.getAttribute("data-title") || card.querySelector("h3").textContent; }
        if(modalDesc){ modalDesc.textContent = card.getAttribute("data-desc") || ""; }
        if(modalAvail){ modalAvail.textContent = card.getAttribute("data-avail") || "Available"; }
        modalBackdrop.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });

    function closeModal(){
      modalBackdrop.classList.remove("open");
      document.body.style.overflow = "";
    }
    modalBackdrop.addEventListener("click", function(e){
      if(e.target === modalBackdrop) closeModal();
    });
    var closeBtn = modalBackdrop.querySelector(".modal-close");
    if(closeBtn) closeBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", function(e){
      if(e.key === "Escape") closeModal();
    });
  }

  /* Generic form "submit" feedback (static site — no backend) */
  document.querySelectorAll("form[data-demo-form]").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var success = form.parentElement.querySelector(".form-success") || form.querySelector(".form-success");
      if(success){ success.classList.add("show"); success.setAttribute("tabindex","-1"); success.focus(); }
      form.reset();
    });
  });

  /* Back to top */
  var backBtn = document.querySelector(".back-to-top");
  if(backBtn){
    window.addEventListener("scroll", function(){
      backBtn.classList.toggle("show", window.scrollY > 600);
    }, {passive:true});
    backBtn.addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
  }

  /* Footer year */
  document.querySelectorAll("[data-year]").forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* Rental duration price-note helper on booking forms (no prices shown, just duration logic) */
  document.querySelectorAll("[data-duration]").forEach(function(select){
    var note = document.querySelector(select.getAttribute("data-duration"));
    if(!note) return;
    var notes = {
      daily: "Perfect for single-day birthday parties and events.",
      weekly: "Great for multi-day celebrations or weekend-long festivities.",
      monthly: "Best value for venues, studios, or recurring events."
    };
    select.addEventListener("change", function(){
      note.textContent = notes[select.value] || "";
    });
  });
})();
