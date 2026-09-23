const navToggle = document.querySelector('.nav-toggle');
const navPanel = document.querySelector('.nav-panel');
const navLinks = document.querySelectorAll('.nav-panel a');
const sections = document.querySelectorAll('main section[id]');
const revealItems = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const backToTopBtn = document.getElementById('backToTop');
const certModal = document.getElementById('certModal');
const certFrame = document.getElementById('certFrame');
const modalClose = document.querySelector('.modal-close');
const certPreviewButtons = document.querySelectorAll('.preview');
const contactForm = document.getElementById('contactForm');

if (navToggle && navPanel) {
  navToggle.addEventListener('click', () => {
    const isOpen = navPanel.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navPanel.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const setActiveNavLink = () => {
  let currentId = 'home';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 180 && rect.bottom >= 180) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isActive = href === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
};

window.addEventListener('scroll', setActiveNavLink, { passive: true });
setActiveNavLink();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));

    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category.includes(filter);
      card.classList.toggle('hidden-project', !matches);
    });
  });
});

const openCertModal = (pdfPath, title) => {
  certFrame.src = pdfPath;
  certModal.classList.add('open');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  certModal.setAttribute('data-title', title || 'Certificate preview');
};

const closeCertModal = () => {
  certModal.classList.remove('open');
  certModal.setAttribute('aria-hidden', 'true');
  certFrame.src = '';
  document.body.style.overflow = '';
};

certPreviewButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.certificate-card');
    const pdfPath = card?.dataset.pdf;
    const title = card?.dataset.title;

    if (pdfPath) {
      openCertModal(pdfPath, title);
    }
  });
});

modalClose.addEventListener('click', closeCertModal);
certModal.addEventListener('click', (event) => {
  if (event.target === certModal) {
    closeCertModal();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && certModal.classList.contains('open')) {
    closeCertModal();
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (contactForm) {
  const form = contactForm;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      emailInput.setCustomValidity('Please enter a valid email address.');
      emailInput.reportValidity();
      emailInput.setCustomValidity('');
      return;
    }

    const body = `Hello Nancy,\n\n${message}\n\nBest regards,\n${fullName}\nEmail: ${email}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent('kamikazinancy32@gmail.com')}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = gmailUrl;
  });
}
