async function loadConfigAndImages() {
  const container = document.querySelector('.scrollband');
  container.innerHTML = '';

  const overlay = document.createElement('div');
  overlay.id = 'band-label';
  overlay.style.position = 'absolute';
  overlay.style.left = '40px';
  overlay.style.bottom = '150px';
  overlay.style.color = 'white';
  overlay.style.fontSize = '24px';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 1s ease, transform 1s ease';
  overlay.style.pointerEvents = 'none';
  overlay.style.fontFamily = 'sans-serif';
  overlay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.6)';
  overlay.style.transform = 'translateX(-50px)';
  document.body.appendChild(overlay);

  let manifest;
  try {
    const res = await fetch('manifest.json');
    manifest = await res.json();
  } catch (e) {
    console.error('manifest.json konnte nicht geladen werden:', e);
    return;
  }

  const sponsorCategories = [
    { key: 'gold', path: 'media/01_gold/', className: 'gold', repeat: 3, label: 'Wir danken unseren Gold Sponsoren' },
    { key: 'silver', path: 'media/02_silber/', className: 'silver', repeat: 2, label: 'Wir danken unseren Silber Sponsoren' },
    { key: 'bronze', path: 'media/03_bronze/', className: 'bronze', repeat: 1, label: 'Wir danken unseren Bronze Sponsoren' }
  ];

  const bands = sponsorCategories.map(category => {
    const files = manifest[category.key];
    if (!files || files.length === 0) return null;

    const band = document.createElement('div');
    band.className = `scrolling-band ${category.className}`;
    band.style.display = 'none';
    band.style.opacity = '0';
    band.style.transition = 'opacity 1s ease';

    const wrapper = document.createElement('div');
    wrapper.className = 'scrolling-wrapper';
    wrapper.style.setProperty('--scroll-delay', '0s');
    wrapper.style.setProperty('--gap', '50px');

    const logos = document.createElement('div');
    logos.className = 'scrolling-logos';

    files.forEach(file => {
      const wrapperLogo = document.createElement('div');
      wrapperLogo.className = `logo-wrapper`;
      const img = document.createElement('img');
      img.src = category.path + file;
      img.alt = file.split('.')[0];
      wrapperLogo.appendChild(img);
      logos.appendChild(wrapperLogo);
    });

    wrapper.appendChild(logos);
    band.appendChild(wrapper);
    container.appendChild(band);
    return { band, wrapper, repeat: category.repeat, label: category.label };
  }).filter(Boolean);

  runBandLoop(bands);
}

function runBandLoop(bands) {
  let index = 0;
  const label = document.getElementById('band-label');

  function showBand(band, repeat, labelText, doneCallback) {
    let cycle = 0;

    function runCycle() {
      const wrapper = band.wrapper;
      const logoCount = wrapper.querySelectorAll('.logo-wrapper').length;
      const logoDuration = parseInt(document.getElementById('speedSlider')?.value || '10');
      const scrollDuration = logoCount * logoDuration * 1000;

      wrapper.style.setProperty('--scroll-duration', `${scrollDuration / 1000}s`);
      wrapper.style.animation = 'none';
      wrapper.offsetHeight;
      wrapper.style.animation = '';

      if (cycle === 0) {
        band.band.style.display = 'block';
        setTimeout(() => {
          band.band.style.opacity = '1';
          if (label) {
            label.textContent = labelText;
            label.style.opacity = '1';
            label.style.transform = 'translateX(0)';
          }
        }, 50);
      }

      setTimeout(() => {
        cycle++;
        if (cycle < repeat) {
          runCycle();
        } else {
          band.band.style.opacity = '0';
          if (label) {
            label.style.opacity = '0';
            label.style.transform = 'translateX(-50px)';
          }
          setTimeout(() => {
            band.band.style.display = 'none';
            doneCallback();
          }, 1000);
        }
      }, scrollDuration);
    }

    runCycle();
  }

  function next() {
    const band = bands[index];
    showBand(band, band.repeat, band.label, () => {
      index = (index + 1) % bands.length;
      setTimeout(next, 10000);
    });
  }

  if (bands.length > 0) next();
}

function showPanel() {
  document.querySelector('.config-panel')?.classList.add('visible');
  document.body.classList.add('show-cursor');
}

function hidePanel() {
  document.querySelector('.config-panel')?.classList.remove('visible');
  document.body.classList.remove('show-cursor');
}

window.onload = loadConfigAndImages;