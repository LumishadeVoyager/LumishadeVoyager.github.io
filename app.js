document.documentElement.classList.add('js');
document.querySelector('#year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

const revealTargets = document.querySelectorAll('.project-feature, .project-card, .side-builds > article, .experience-item, .making-shot, .social-card, .capability-map article');
revealTargets.forEach((element) => element.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

revealTargets.forEach((element) => observer.observe(element));

const gallery = document.querySelector('#gallery');
const photoTemplate = document.querySelector('#photo-template');
const viewer = document.querySelector('#viewer');
const viewerImage = document.querySelector('#viewer-image');
const viewerTitle = document.querySelector('#viewer-title');

fetch('data/photos.json')
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('影像记录暂时不可用')))
  .then((photos) => {
    const selected = photos.slice(-6).reverse();
    const fragment = document.createDocumentFragment();

    selected.forEach((photo, index) => {
      const item = photoTemplate.content.cloneNode(true);
      const button = item.querySelector('.photo-note');
      const image = item.querySelector('img');
      image.src = photo.preview;
      image.alt = `日常影像记录 ${index + 1}`;
      item.querySelector('span').textContent = photo.capturedAt || String(index + 1).padStart(2, '0');
      button.addEventListener('click', () => {
        viewerImage.src = photo.original;
        viewerImage.alt = image.alt;
        viewerTitle.textContent = `VISUAL NOTE / ${photo.capturedAt || 'UNDATED'}`;
        viewer.showModal();
      });
      fragment.append(item);
    });

    gallery.append(fragment);
  })
  .catch((error) => {
    gallery.innerHTML = `<p class="gallery-error">${error.message}</p>`;
  });

document.querySelector('#close-viewer')?.addEventListener('click', () => viewer.close());
viewer?.addEventListener('click', (event) => {
  if (event.target === viewer) viewer.close();
});

fetch('data/socials.json')
  .then((response) => response.ok ? response.json() : {})
  .then((profiles) => {
    document.querySelectorAll('[data-platform]').forEach((card) => {
      const url = profiles[card.dataset.platform];
      if (!url) return;

      card.href = url;
      card.target = '_blank';
      card.rel = 'noreferrer';
      card.removeAttribute('aria-disabled');
      card.classList.remove('pending-profile');
      const status = card.querySelector('.social-status');
      if (status) status.textContent = 'OPEN PROFILE ↗';
    });
  })
  .catch(() => {});
