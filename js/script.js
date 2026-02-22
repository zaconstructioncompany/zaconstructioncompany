// =====================================
// ZA Construction - Interactive Scripts
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  // Construction-themed splash screen (first Home load only)
  const splashImages = [
    "supportingimages/09d9b75f-b465-49e9-802b-0ebd962e1aaa.JPG",
    "supportingimages/0b87e059-f3f4-4171-9998-342f48dc002c.JPG",
    "supportingimages/1471648f-b747-4ceb-b190-b8abf7aa0164.JPG",
    "supportingimages/30219c4c-7f9f-4327-aac0-8e023bd2ea67.JPG",
    "supportingimages/58877b27-ebbb-467c-8bbe-ea79220d7234.JPG",
    "supportingimages/e27671e8-9b73-49a6-9f18-f934acc028e5.JPG"
  ];

  const path = window.location.pathname.toLowerCase();
  const isHome = path.endsWith("/") || path.endsWith("/index.html");
  let splashSeen = false;
  try {
    splashSeen = window.sessionStorage.getItem("zaSplashSeen") === "1";
  } catch (err) {
    splashSeen = false;
  }

  if (isHome && !splashSeen) {
    document.body.classList.add("loading-lock");
    const splash = document.createElement("div");
    splash.className = "splash-screen";
    splash.innerHTML = `
      <div class="splash-inner">
        <div class="splash-brand">
          <img src="logo.png" alt="ZA Construction Company Logo">
          <span>ZA Construction Company</span>
        </div>
        <h2 class="splash-title">Setting Every Block In Place...</h2>
        <div class="splash-grid">
          ${splashImages
            .map(
              (src, idx) => `
            <div class="fall-tile" style="--delay:${(idx * 0.16).toFixed(2)}s">
              <img src="${src}" alt="Construction progress visual ${idx + 1}">
            </div>`
            )
            .join("")}
        </div>
        <div class="splash-progress"><span></span></div>
      </div>
    `;
    document.body.prepend(splash);

    let splashHidden = false;
    const hideSplash = () => {
      if (splashHidden) return;
      splashHidden = true;
      splash.classList.add("hide");
      document.body.classList.remove("loading-lock");
      window.setTimeout(() => splash.remove(), 700);
      try {
        window.sessionStorage.setItem("zaSplashSeen", "1");
      } catch (err) {
        // no-op
      }
    };

    window.addEventListener("load", () => window.setTimeout(hideSplash, 1700), { once: true });
    window.setTimeout(hideSplash, 3000);
  }

  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const scrollBtn = document.querySelector(".scroll-top");

  // Quick constructing entrance animation for page elements
  const quickBuildElements = document.querySelectorAll(".top-strip, .site-header, .hero-content, .page-hero .container");
  quickBuildElements.forEach((el, idx) => {
    el.classList.add("quick-build");
    el.style.setProperty("--qb-delay", `${(idx * 0.08).toFixed(2)}s`);
  });

  const handleScrollState = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 16);
    if (scrollBtn) scrollBtn.classList.toggle("visible", y > 280);
  };

  window.addEventListener("scroll", handleScrollState, { passive: true });
  handleScrollState();

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Section reveal animation
  const revealBlocks = document.querySelectorAll("[data-reveal]");
  revealBlocks.forEach((block) => {
    const animatedChildren = block.querySelectorAll(".card, .project-item, .work-chip, .image-stack img");
    animatedChildren.forEach((el, idx) => {
      el.style.setProperty("--delay", `${(idx * 0.07).toFixed(2)}s`);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    revealBlocks.forEach((block) => observer.observe(block));
  } else {
    revealBlocks.forEach((block) => block.classList.add("show"));
  }

  // Button click ripple effect
  const interactiveButtons = document.querySelectorAll(".btn, .work-chip, .card");
  interactiveButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const ripple = document.createElement("span");
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius = diameter / 2;
      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${event.clientX - this.getBoundingClientRect().left - radius}px`;
      ripple.style.top = `${event.clientY - this.getBoundingClientRect().top - radius}px`;
      ripple.classList.add("ripple");
      const existingRipple = this.querySelector(".ripple");
      if (existingRipple) existingRipple.remove();
      this.appendChild(ripple);
    });
  });

  // Work chip active state
  const workChips = document.querySelectorAll(".work-chip");
  workChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });
  });

  // Contact form submission to Telegram Bot API
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        formStatus.textContent = "Please fill all required fields correctly.";
        formStatus.style.color = "#ff6b6b";
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const botToken = String(formData.get("tg_bot_token") || "").trim();
      const chatId = String(formData.get("tg_chat_id") || "").trim();

      if (
        !botToken ||
        !chatId ||
        botToken.includes("YOUR_TELEGRAM_BOT_TOKEN") ||
        chatId.includes("YOUR_TELEGRAM_CHAT_ID")
      ) {
        formStatus.textContent = "Configure Telegram bot token and chat ID in contact.html.";
        formStatus.style.color = "#ff6b6b";
        return;
      }

      const message = [
        "New Inquiry - ZA Construction Company",
        "",
        `Name: ${formData.get("name")}`,
        `Email: ${formData.get("email")}`,
        `Phone: ${formData.get("phone")}`,
        `Project Location: ${formData.get("location")}`,
        `Message: ${formData.get("message")}`
      ].join("\n");

      formStatus.textContent = "Submitting your inquiry...";
      formStatus.style.color = "#ffb35f";

      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: message
          })
        });

        const result = await response.json();
        if (result.ok) {
          formStatus.textContent = "Inquiry submitted successfully.";
          formStatus.style.color = "#63d39b";
          contactForm.reset();
          return;
        }

        formStatus.textContent = "Telegram submission failed. Verify bot token and chat ID.";
        formStatus.style.color = "#ff6b6b";
      } catch (error) {
        formStatus.textContent = "Network error. Please try again.";
        formStatus.style.color = "#ff6b6b";
      }
    });
  }

  // Hidden credit (visible only when focused)
  if (!document.querySelector(".mnqazi-credit")) {
    const credit = document.createElement("span");
    credit.className = "mnqazi-credit";
    credit.tabIndex = 0;
    credit.setAttribute("aria-label", "Design and developed by mnqazi");
    credit.textContent = "Design and developed by mnqazi";
    document.body.appendChild(credit);
  }
});
