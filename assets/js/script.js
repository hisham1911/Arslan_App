(function () {
  "use strict";

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navbar = document.getElementById("navbar");
  const scrollTopBtn = document.getElementById("scrollTop");

  // Accessible menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = !navLinks.classList.toggle("show") ? false : true;
      menuToggle.classList.toggle("open");
      // set aria-expanded correctly
      menuToggle.setAttribute(
        "aria-expanded",
        String(navLinks.classList.contains("show"))
      );
    });

    // close menu when a nav link is clicked and mark current
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        navLinks.classList.remove("show");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        // set aria-current for single-page nav
        navLinks
          .querySelectorAll("a")
          .forEach((a) => a.removeAttribute("aria-current"));
        link.setAttribute("aria-current", "true");
      });
    });

    // allow ESC to close the mobile nav for accessibility
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") {
        navLinks.classList.remove("show");
        menuToggle.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Smooth in-page anchor scroll with offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      const yOffset = navbar ? navbar.offsetHeight + 20 : 0;
      const elementTop =
        target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementTop - yOffset, behavior: "smooth" });
    });
  });

  const revealItems = document.querySelectorAll(
    ".service-card, .service-card-enhanced, .testimonial-card, .contact-form, .contact-info, .partner-logo, .highlight-reveal"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add stagger delay for partner logos
          if (entry.target.classList.contains("partner-logo")) {
            const delay =
              Array.from(entry.target.parentElement.children).indexOf(
                entry.target
              ) * 100;
            setTimeout(() => {
              entry.target.classList.add("in-view");
            }, delay);
          } else {
            entry.target.classList.add("in-view");
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  const counters = document.querySelectorAll(".count-up");

  const animateCount = (el) => {
    const target = parseInt(el.dataset.target, 10) || 0;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = parseInt(el.dataset.duration, 10) || 1800;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = `${prefix}${current}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  const handleScrollUI = () => {
    const y = window.scrollY || window.pageYOffset;
    if (scrollTopBtn) {
      if (y > 320) {
        scrollTopBtn.classList.add("show");
      } else {
        scrollTopBtn.classList.remove("show");
      }
    }
    if (navbar) {
      if (y > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  };

  window.addEventListener("scroll", handleScrollUI, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // إرسال الرسالة إلى سكربت PHP في الخادم بدون الاعتماد على برنامج البريد
  const supportForm = document.getElementById("supportForm");
  if (supportForm) {
    const statusEl = document.getElementById("formStatus");

    supportForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const currentLang = localStorage.getItem("site_lang") || "ar";

      if (statusEl) {
        statusEl.textContent =
          translations[currentLang]?.["form.status_sending"] ||
          "جارٍ إرسال الرسالة...";
        statusEl.classList.remove("error");
        statusEl.classList.add("pending");
      }

      const formData = new FormData(supportForm);
      formData.append("form_type", "contact");
      if (csrfToken) formData.append("csrf_token", csrfToken);

      try {
        const response = await fetch("send_mail.php", {
          method: "POST",
          body: formData,
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && (data.success === true || !data.error)) {
          supportForm.reset();
          const successMsg =
            translations[currentLang]?.["form.status_success"] ||
            "تم إرسال رسالتك بنجاح! سنقوم بالتواصل معك في أقرب وقت.";
          if (statusEl) {
            statusEl.textContent = successMsg;
            statusEl.classList.remove("pending", "error");
            statusEl.classList.add("success");
          } else {
            alert(successMsg);
          }
        } else {
          throw new Error(data.error || "حدث خطأ غير متوقع");
        }
      } catch (err) {
        const errorMsg =
          translations[currentLang]?.["form.status_error"] ||
          "تعذر إرسال الرسالة حالياً، برجاء المحاولة مرة أخرى لاحقاً.";
        if (statusEl) {
          statusEl.textContent = errorMsg;
          statusEl.classList.remove("pending", "success");
          statusEl.classList.add("error");
        } else {
          alert(errorMsg);
        }
      }
    });
  }

  // Academy Registration Form (simple submit similar to supportForm)
  const academyForm = document.getElementById("academyRegisterForm");
  if (academyForm) {
    const academyStatus = document.getElementById("academyFormStatus");

    const validateAcademyField = (field) => {
      let valid = true;
      if (field.hasAttribute("required") && !field.value.trim()) valid = false;
      if (field.type === "email" && field.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(field.value)) valid = false;
      }
      field.classList.toggle("error", !valid);
      field.classList.toggle("valid", valid);
      return valid;
    };

    academyForm.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("blur", () => validateAcademyField(el));
      el.addEventListener("input", () => {
        if (el.classList.contains("error")) validateAcademyField(el);
      });
    });

    academyForm.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const currentLang = localStorage.getItem("site_lang") || "ar";
      const t = (k, fallback) =>
        (translations[currentLang] && translations[currentLang][k]) || fallback;

      // validate all
      let allValid = true;
      academyForm
        .querySelectorAll("input[required], select[required]")
        .forEach((f) => {
          if (!validateAcademyField(f)) allValid = false;
        });
      if (!allValid) return;

      if (academyStatus) {
        academyStatus.textContent = t(
          "academy_page.form.sending",
          currentLang === "ar" ? "جارٍ الإرسال..." : "Sending..."
        );
        academyStatus.className = "form-status pending";
      }

      const formData = new FormData(academyForm);
      formData.append("form_type", "academy");
      if (csrfToken) formData.append("csrf_token", csrfToken);
      try {
        const res = await fetch("send_mail.php", {
          method: "POST",
          body: formData,
        });
        // assume success if 200
        if (res.ok) {
          academyForm.reset();
          if (academyStatus) {
            academyStatus.textContent = t(
              "academy_page.form.success",
              currentLang === "ar"
                ? "تم الاستلام بنجاح"
                : "Received successfully"
            );
            academyStatus.className = "form-status success";
          }
        } else throw new Error("Request failed");
      } catch (err) {
        if (academyStatus) {
          academyStatus.textContent = t(
            "academy_page.form.error",
            currentLang === "ar" ? "تعذر الإرسال حالياً" : "Could not send now"
          );
          academyStatus.className = "form-status error";
        }
      }
    });
  }

  /* ====== Simple i18n / Language switcher ====== */

  const scriptElement =
    document.currentScript ||
    document.querySelector('script[src*="assets/js/script.js"]');

  const resolveI18nUrl = (lang) => {
    try {
      if (scriptElement && scriptElement.src) {
        return new URL(`../i18n/${lang}.json`, scriptElement.src).href;
      }
    } catch (err) {
      console.warn("Failed to resolve i18n URL from script source", err);
    }
    const basePath =
      window.location.origin && window.location.origin !== "file://"
        ? `${window.location.origin}/assets/i18n/`
        : "assets/i18n/";
    return `${basePath}${lang}.json`;
  };
  // Inline fallbacks (kept for environments where fetch of local files may fail)
  const translationsInline = {
    en: /* inline content omitted here (kept above in file) */ null,
    ar: /* inline content omitted here (kept above in file) */ null,
  };

  // We'll attempt to load external JSON translation files from /assets/i18n/*.json
  let translations = {};

  async function loadExternalTranslations() {
    try {
      const enResp = await fetch(resolveI18nUrl("en"));
      const arResp = await fetch(resolveI18nUrl("ar"));
      if (!enResp.ok || !arResp.ok)
        throw new Error("Failed to fetch i18n files");
      const en = await enResp.json();
      const ar = await arResp.json();
      translations = { en, ar };
      console.info("Loaded external translations");
    } catch (err) {
      // Fallback: try to recover translations from existing in-file definitions
      console.warn(
        "Could not load external translations, using inline fallbacks. Error:",
        err
      );
      // Recreate translations from current inline object by reading dataset keys already present in the file.
      // For simplicity we keep the existing translations object defined earlier in the file scope (if present).
      // We'll parse keys from the DOM defaults where possible.
      // As a safe fallback, use existing `translations` if already defined, otherwise no-op.
      if (typeof window !== "undefined" && window.__INLINE_TRANSLATIONS__) {
        translations = window.__INLINE_TRANSLATIONS__;
      } else {
        // Minimal fallback: keep translations empty so translatePage leaves original text
        translations = {};
      }
    }
  }

  // Attribute translations: alt, aria-label, title
  function applyAttributeTranslations(lang) {
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.dataset.i18nAlt;
      const txt =
        translations[lang] && translations[lang][key]
          ? translations[lang][key]
          : el.alt;
      el.alt = txt;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      const txt =
        translations[lang] && translations[lang][key]
          ? translations[lang][key]
          : el.getAttribute("aria-label");
      if (txt) el.setAttribute("aria-label", txt);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.dataset.i18nTitle;
      const txt =
        translations[lang] && translations[lang][key]
          ? translations[lang][key]
          : el.title;
      if (txt) el.title = txt;
    });
  }

  // Initialize: try to load external translations, then wire up language buttons
  loadExternalTranslations().finally(() => {
    // store the inline translations as a global fallback so loadExternalTranslations can use them if needed
    if (!window.__INLINE_TRANSLATIONS__)
      window.__INLINE_TRANSLATIONS__ = translationsInline;
    // if external translations weren't loaded, fall back to inline (if available)
    if (!translations.en) {
      // attempt to construct translations from DOM defaults using keys present in the file
      // (we keep it simple: use the previously defined translationsInline if populated)
      translations = window.__INLINE_TRANSLATIONS__ || {};
    }
    // Apply initial language (reads localStorage)
    const saved = localStorage.getItem("site_lang");
    const defaultLang =
      saved ||
      (navigator.language && navigator.language.startsWith("ar") ? "ar" : "en");
    setLanguage(defaultLang || "en");

    // language is now applied, show content if it was hidden during initialization
    document.documentElement.classList.remove("lang-loading");
  });

  const langButtons = document.querySelectorAll(".lang-btn");

  function translatePage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    // Translate page title
    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      const titleKey = titleEl.dataset.i18n;
      if (translations[lang] && translations[lang][titleKey]) {
        document.title = translations[lang][titleKey];
      }
    }

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const txt =
        translations[lang] && translations[lang][key]
          ? translations[lang][key]
          : el.textContent;

      // Special handling for footer copyright with link
      if (key === "footer.copyright") {
        const name =
          lang === "ar"
            ? "<strong>ارسلان تك</strong>"
            : "<strong>Arslan Tech</strong>";
        const prefix =
          lang === "ar"
            ? "جميع الحقوق محفوظة © 2026 - تصميم وتطوير"
            : "Copyright © 2026 - Developed by";
        el.innerHTML = `${prefix} <a href="https://wa.me/201014078319" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${name}</a>`;
      } else {
        el.textContent = txt;
      }
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const txt =
        translations[lang] && translations[lang][key]
          ? translations[lang][key]
          : el.placeholder;
      el.placeholder = txt;
    });

    // attributes (alt / aria-label / title)
    applyAttributeTranslations(lang);

    // toggle active state on buttons
    langButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
  }

  function setLanguage(lang) {
    localStorage.setItem("site_lang", lang);
    translatePage(lang);
    // Update validation messages if form exists
    if (typeof window.updateValidationMessages === "function") {
      window.updateValidationMessages();
    }
  }

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // (initialization handled after attempting to load external translations)

  /* ====== CSRF Protection ====== */
  let csrfToken = "";

  async function fetchCsrfToken() {
    try {
      const response = await fetch("csrf.php");
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.csrf_token;
      }
    } catch (e) {
      console.warn("Failed to fetch CSRF token", e);
    }
  }

  // Fetch token on load
  fetchCsrfToken();
  /* End CSRF Protection */

  /* End i18n */

  /* ====== Sales Form Handler - Enhanced ====== */
  const salesForm = document.getElementById("salesForm");
  if (salesForm) {
    const submitBtn = document.getElementById("submitBtn");
    const successAlert = document.getElementById("successAlert");
    const errorAlert = document.getElementById("errorAlert");
    const errorMessage = document.getElementById("errorMessage");

    // Update validation messages for visible errors
    window.updateValidationMessages = function () {
      const formFields = salesForm.querySelectorAll(
        "input.error, textarea.error, select.error"
      );
      formFields.forEach((field) => {
        validateField(field);
      });
    };

    // Real-time validation
    const validateField = (field) => {
      const errorEl = document.getElementById(`${field.id}-error`);
      let isValid = true;
      let errorMsg = "";
      const currentLang = localStorage.getItem("site_lang") || "ar";

      if (field.hasAttribute("required") && !field.value.trim()) {
        isValid = false;
        errorMsg =
          translations[currentLang]?.["products.validation_required"] ||
          "هذا الحقل مطلوب";
      } else if (field.type === "email" && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          errorMsg =
            translations[currentLang]?.["products.validation_email"] ||
            "البريد الإلكتروني غير صحيح";
        }
      } else if (field.type === "tel" && field.value) {
        const phoneRegex = /^[0-9]{11}$/;
        if (!phoneRegex.test(field.value)) {
          isValid = false;
          errorMsg =
            translations[currentLang]?.["products.validation_phone"] ||
            "رقم الهاتف يجب أن يكون 11 رقم";
        }
      } else if (field.hasAttribute("minlength")) {
        const minLen = parseInt(field.getAttribute("minlength"));
        if (field.value.length < minLen) {
          isValid = false;
          const template =
            translations[currentLang]?.["products.validation_minlength"] ||
            "يجب أن يكون {min} أحرف على الأقل";
          errorMsg = template.replace("{min}", minLen);
        }
      }

      if (errorEl) {
        if (!isValid) {
          field.classList.add("error");
          errorEl.textContent = errorMsg;
          errorEl.classList.add("show");
        } else {
          field.classList.remove("error");
          errorEl.classList.remove("show");
        }
      }

      return isValid;
    };

    // Add blur validation to all form fields
    const formFields = salesForm.querySelectorAll("input, textarea, select");
    formFields.forEach((field) => {
      if (field.name !== "website") {
        // Skip honeypot
        field.addEventListener("blur", () => validateField(field));
        field.addEventListener("input", () => {
          if (field.classList.contains("error")) {
            validateField(field);
          }
        });
      }
    });

    // Form submission
    salesForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Validate all fields
      let isFormValid = true;
      formFields.forEach((field) => {
        if (field.name !== "website" && field.hasAttribute("required")) {
          if (!validateField(field)) {
            isFormValid = false;
          }
        }
      });

      if (!isFormValid) {
        // Scroll to first error
        const firstError = salesForm.querySelector(".error");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
          firstError.focus();
        }
        return;
      }

      // Hide alerts
      successAlert.classList.remove("show");
      errorAlert.classList.remove("show");

      // Disable button and show loading
      submitBtn.disabled = true;

      const formData = new FormData(salesForm);
      formData.append("form_type", "sales");
      if (csrfToken) formData.append("csrf_token", csrfToken);

      try {
        const response = await fetch("send_mail.php", {
          method: "POST",
          body: formData,
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && (data.success === true || !data.error)) {
          // Success
          salesForm.reset();
          successAlert.classList.add("show");

          // Scroll to success message
          successAlert.scrollIntoView({ behavior: "smooth", block: "center" });

          // Auto-hide after 10 seconds
          setTimeout(() => {
            successAlert.classList.remove("show");
          }, 10000);

          // Remove error states
          formFields.forEach((field) => {
            field.classList.remove("error");
            const errorEl = document.getElementById(`${field.id}-error`);
            if (errorEl) errorEl.classList.remove("show");
          });
        } else {
          throw new Error(data.error || "حدث خطأ غير متوقع");
        }
      } catch (err) {
        // Error
        const currentLang = localStorage.getItem("site_lang") || "ar";
        if (errorMessage) {
          errorMessage.textContent =
            err.message ||
            translations[currentLang]?.["products.form_error_msg"] ||
            "تعذر إرسال الطلب، برجاء المحاولة مرة أخرى.";
        }
        errorAlert.classList.add("show");

        // Scroll to error message
        errorAlert.scrollIntoView({ behavior: "smooth", block: "center" });

        // Auto-hide after 8 seconds
        setTimeout(() => {
          errorAlert.classList.remove("show");
        }, 8000);
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
      }
    });

    // Auto-dismiss alerts on close button click (handled in HTML onclick)
  }
  /* End Sales Form Handler */

  // Floating Contact Menu Toggle
  const floatingToggleBtn = document.getElementById("floatingToggleBtn");
  const floatingContactMenu = document.getElementById("floatingContactMenu");
  const floatingIcon = document.getElementById("floatingIcon");
  const socialIconsGroup = document.querySelector(".social-icons-group");

  if (floatingToggleBtn && socialIconsGroup && floatingIcon) {
    floatingToggleBtn.addEventListener("click", () => {
      const isExpanded = socialIconsGroup.classList.toggle("show");
      floatingToggleBtn.setAttribute("aria-expanded", isExpanded);

      if (isExpanded) {
        floatingIcon.classList.remove("fa-comments");
        floatingIcon.classList.add("fa-times");
        floatingIcon.style.transform = "rotate(180deg)";
      } else {
        floatingIcon.classList.remove("fa-times");
        floatingIcon.classList.add("fa-comments");
        floatingIcon.style.transform = "rotate(0deg)";
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        floatingContactMenu &&
        !floatingContactMenu.contains(event.target) &&
        socialIconsGroup.classList.contains("show")
      ) {
        socialIconsGroup.classList.remove("show");
        floatingToggleBtn.setAttribute("aria-expanded", "false");
        floatingIcon.classList.remove("fa-times");
        floatingIcon.classList.add("fa-comments");
        floatingIcon.style.transform = "rotate(0deg)";
      }
    });
  }

  // Close the IIFE started at the top of this file
})();
