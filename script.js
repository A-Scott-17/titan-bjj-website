const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');

toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  menu.classList.toggle('open');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.classList.contains('open')) {
    menu.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open navigation');
    toggle?.focus();
  }
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const today = new Date().getDay();
const todayCard = document.querySelector(`.calendar-day[data-weekday="${today}"]`);
if (todayCard) {
  todayCard.classList.add('is-today');
  todayCard.setAttribute('aria-current', 'date');
}

const slider = document.querySelector('.photo-slider');
if (slider) {
  const slides = [...slider.querySelectorAll('.photo-slide')];
  const dots = [...slider.querySelectorAll('.slider-dots button')];
  let activeSlide = 0;
  let rotation;
  const showSlide = (index) => {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide));
    dots.forEach((dot, dotIndex) => {
      const selected = dotIndex === activeSlide;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-selected', String(selected));
    });
  };
  const startRotation = () => { window.clearInterval(rotation); rotation = window.setInterval(() => showSlide(activeSlide + 1), 5500); };
  const resetRotation = () => { window.clearInterval(rotation); startRotation(); };
  slider.querySelector('.slider-prev')?.addEventListener('click', () => { showSlide(activeSlide - 1); resetRotation(); });
  slider.querySelector('.slider-next')?.addEventListener('click', () => { showSlide(activeSlide + 1); resetRotation(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); resetRotation(); }));
  slider.addEventListener('mouseenter', () => window.clearInterval(rotation));
  slider.addEventListener('mouseleave', startRotation);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startRotation();
}

const instagramFeed = document.querySelector('.instagram-feed');
const instagramEndpoint = document.documentElement.dataset.instagramFeedUrl;

if (instagramFeed && instagramEndpoint) {
  fetch(instagramEndpoint)
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Instagram feed unavailable'))))
    .then((payload) => {
      const posts = Array.isArray(payload) ? payload : payload.data;
      if (!Array.isArray(posts) || !posts.length) throw new Error('No Instagram posts available');
      instagramFeed.innerHTML = `<div class="instagram-posts">${posts.slice(0, 3).map((post) => {
        const image = post.media_url || post.thumbnail_url;
        if (!image || !post.permalink) return '';
        const caption = (post.caption || 'Titan Jiujitsu on Instagram').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
        return `<a class="instagram-post" href="${post.permalink}" target="_blank" rel="noreferrer"><img src="${image}" alt="${caption}" loading="lazy" /><span>View on Instagram ↗</span></a>`;
      }).join('')}</div>`;
    })
    .catch(() => {
      // The accessible profile link remains visible if the authorized feed endpoint is not configured.
    });
}
