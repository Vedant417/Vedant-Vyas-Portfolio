document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Logic
  initTheme();

  // Navigation Mobile Menu Toggle
  initMobileMenu();

  // Scroll header styling & active link highlight
  initScrollEffects();

  // Typewriter effect in Hero Section
  initTypewriter();

  // Background Interactive Canvas Particles
  initParticles();

  // Scroll reveal animation using Intersection Observer
  initScrollReveal();


  // Contact Form submit handling
  initContactForm();
});

/* ========================================================================= */
/* 1. Theme Configuration                                                    */
/* ========================================================================= */
function initTheme() {
  const themeToggleBtn = document.querySelector('.theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'dark';

  document.documentElement.setAttribute('data-theme', storedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ========================================================================= */
/* 2. Mobile Menu Navigation                                                 */
/* ========================================================================= */
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.classList.toggle('toggle');
  });

  // Close menu when a link is clicked
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('toggle');
    });
  });
}

/* ========================================================================= */
/* 3. Header Scroll Styling & Navigation Sync                                */
/* ========================================================================= */
function initScrollEffects() {
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Nav active link synchronisation
    let currentId = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ========================================================================= */
/* 4. Typewriter Animation                                                   */
/* ========================================================================= */
function initTypewriter() {
  const typewriterText = document.getElementById('typewriter-text');
  if (!typewriterText) return;

  const roles = [
    'AI Software Engineer',
    'Full Stack Developer',
    'Generative AI Developer',
    'LLM Application Developer',
    'FastAPI Backend Engineer',
    'React.js Developer'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ========================================================================= */
/* 5. Interactive Particle Canvas Background                                 */
/* ========================================================================= */
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;

  // Particle Settings
  const particleCount = 60;
  const particles = [];
  const connectionDistance = 120;
  let mouse = { x: null, y: null, radius: 100 };

  // Adjust canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse tracking
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = Math.random() * 0.6 - 0.3;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off walls
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse interactive push/pull
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 0.8;
          const directionY = forceDirectionY * force * 0.8;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      ctx.fillStyle = currentTheme === 'light' ? 'rgba(79, 70, 229, 0.4)' : 'rgba(99, 102, 241, 0.4)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Populate particles array
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines
  function connectParticles() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const lineColor = currentTheme === 'light' ? '79, 70, 229' : '99, 102, 241';

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Performance preservation: only animate when hero is visible
  animate();
}

/* ========================================================================= */
/* 6. Scroll Reveal Animation                                                */
/* ========================================================================= */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animation triggered
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}


/* ========================================================================= */
/* 8. Contact Form Validation                                                */
/* ========================================================================= */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const statusEl = document.querySelector('.form-status');

    if (!form || !statusEl) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showStatus("Please fill in all fields.", "error");
            return;
        }

        if (!validateEmail(email)) {
            showStatus("Please enter a valid email.", "error");
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

        fetch("https://script.google.com/macros/s/AKfycbw8awCNHBHZXfP-cwJsBMB5hjdg1WwF8_K4xtf-PjyhlLi6H8QTj3iVGHjnbZywzgqW/exec", {
            method: "POST",
            body: new URLSearchParams({
                Name: name,
                Email: email,
                Subject: subject,
                Message: message
            })
        })
        .then(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            showStatus("Thank you! Your message has been sent successfully.", "success");
            form.reset();
        })
        .catch(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            showStatus("Something went wrong. Please try again.", "error");
        });
    });

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showStatus(msg, type) {
        statusEl.style.display = "block";
        statusEl.textContent = msg;
        statusEl.className = "form-status " + type;

        setTimeout(() => {
            statusEl.style.display = "none";
        }, 5000);
    }
}