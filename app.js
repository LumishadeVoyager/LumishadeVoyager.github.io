const gallery = document.querySelector('#gallery');
const template = document.querySelector('#photo-template');
const viewer = document.querySelector('#viewer');
const viewerImage = document.querySelector('#viewer-image');
const download = document.querySelector('#download');

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#close-viewer').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });

fetch('data/photos.json')
  .then((response) => response.ok ? response.json() : Promise.reject(new Error('作品清单尚未生成')))
  .then((photos) => {
    document.querySelector('#photo-count').textContent = `${photos.length} 幅作品`;
    const fragment = document.createDocumentFragment();
    photos.forEach((photo, index) => {
      const item = template.content.cloneNode(true);
      const button = item.querySelector('.photo');
      const image = item.querySelector('img');
      image.src = photo.preview;
      image.alt = `摄影作品 ${index + 1}`;
      item.querySelector('.photo-index').textContent = String(index + 1).padStart(3, '0');
      button.addEventListener('click', () => {
        viewerImage.src = photo.original;
        viewerImage.alt = `摄影作品 ${index + 1} 原始尺寸`;
        download.href = photo.original;
        download.download = photo.filename;
        viewer.showModal();
      });
      fragment.append(item);
    });
    gallery.append(fragment);
  })
  .catch((error) => { document.querySelector('#photo-count').textContent = error.message; });
