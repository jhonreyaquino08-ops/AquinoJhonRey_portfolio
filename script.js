document.addEventListener("DOMContentLoaded", () => {
    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Highlight the nav link of the section on screen
    const sections = document.querySelectorAll("main section");
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveLink() {
        let currentSection = "home";

        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 160) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentSection}`;
            link.classList.toggle("active", isActive);
        });
    }

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();

    // Sections fade in when they enter the screen
    const revealTargets = document.querySelectorAll("main section:not(.home)");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ("IntersectionObserver" in window && !reduceMotion) {
        revealTargets.forEach((el) => el.classList.add("reveal"));

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                entry.target.classList.toggle("visible", entry.isIntersecting);
            });
        }, { threshold: 0.15 });

        revealTargets.forEach((el) => revealObserver.observe(el));
    }

    // Mobile menu
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNav = document.getElementById("main-nav");

    function setMenu(open) {
        mainNav.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menuToggle.textContent = open ? "✕" : "☰";
    }

    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            setMenu(!mainNav.classList.contains("open"));
        });

        mainNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMenu(false));
        });
    }

    // Skills carousel
    const skillCards = document.querySelectorAll(".skill-card");
    const skillCarousel = document.querySelector(".skill-carousel");
    const skillDots = document.querySelector(".skill-dots");

    if (skillCards.length && skillCarousel && skillDots) {
        const total = skillCards.length;
        let activeSkill = 0;

        skillCards.forEach((_, i) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "skill-dot";
            dot.setAttribute("aria-label", `Show skill ${i + 1}`);
            dot.addEventListener("click", () => showSkill(i));
            skillDots.appendChild(dot);
        });

        const dots = skillDots.querySelectorAll(".skill-dot");

        // Sets each card's position (0 = center) relative to the active one
        function showSkill(index) {
            activeSkill = (index + total) % total;

            skillCards.forEach((card, i) => {
                let offset = (i - activeSkill + total) % total;
                if (offset > total / 2) offset -= total;
                card.dataset.pos = offset;
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === activeSkill);
            });
        }

        skillCards.forEach((card, i) => {
            card.addEventListener("click", () => showSkill(i));
        });

        document.getElementById("skill-prev").addEventListener("click", () => showSkill(activeSkill - 1));
        document.getElementById("skill-next").addEventListener("click", () => showSkill(activeSkill + 1));

        let touchStartX = 0;

        skillCarousel.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });

        skillCarousel.addEventListener("touchend", (e) => {
            const diff = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diff) > 40) {
                showSkill(activeSkill + (diff < 0 ? 1 : -1));
            }
        });

        showSkill(0);
    }

    // Resume viewer
    const resumeModal = document.getElementById("resume-modal");
    const resumeOpen = document.getElementById("resume-open");
    const resumeClose = document.getElementById("resume-close");

    if (resumeModal && resumeOpen && resumeClose) {
        function setResume(open) {
            resumeModal.hidden = !open;
            document.body.style.overflow = open ? "hidden" : "";

            if (open) {
                resumeClose.focus();
            } else {
                resumeOpen.focus();
            }
        }

        resumeOpen.addEventListener("click", () => setResume(true));
        resumeClose.addEventListener("click", () => setResume(false));

        resumeModal.addEventListener("click", (e) => {
            if (e.target === resumeModal) {
                setResume(false);
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !resumeModal.hidden) {
                setResume(false);
            }
        });
    }

    // Projects and certificates tabs
    const tabButtons = document.querySelectorAll(".tab");
    const tabPanels = document.querySelectorAll(".tab-panel");

    function showTab(name) {
        tabButtons.forEach((tab) => {
            const isActive = tab.dataset.tab === name;
            tab.classList.toggle("active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });

        tabPanels.forEach((panel) => {
            panel.classList.toggle("active", panel.id === `panel-${name}`);
        });
    }

    tabButtons.forEach((tab) => {
        tab.addEventListener("click", () => showTab(tab.dataset.tab));
    });
});