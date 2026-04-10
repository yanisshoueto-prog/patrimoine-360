import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 15000,
});

// Automatically attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized globally (e.g., when DB is wiped and token becomes invalid)
api.interceptors.response.use(
  (response) => {
    const webpImages = [
      '/Masque 3 guelede.webp',
      '/zjhnzs.webp',
      '/sCULPTURE BOIS2.webp',
      '/masque.webp',
      '/sCULPTURE BOIS.webp',
      '/masque2.webp',
      '/Egungun 2.webp',
      '/Trone.webp',
      '/zjhnzs.webp',
      '/sCULPTURE BOIS2.webp'
    ];
    if (response.config && response.config.url && response.config.url.includes('/api/artworks')) {
        let count = 0;
        const replaceImage = (obj) => {
            if (obj && typeof obj === 'object') {
                const lowerTitle = (obj.titre || '').toLowerCase();
                const lowerTech = (obj.technique || '').toLowerCase();
                
                if (lowerTitle.includes('trône') || lowerTitle.includes('trone')) {
                    obj.image = '/Trone.webp';
                } else if (lowerTitle.includes('gèlèdé') || lowerTitle.includes('gelede')) {
                    obj.image = '/Masque 3 guelede.webp';
                } else if (lowerTitle.includes('egungun')) {
                    obj.image = '/Egungun 2.webp';
                } else if (lowerTitle.includes('bronze') || lowerTitle.includes('reine mère') || lowerTitle.includes('plaque') || lowerTech.includes('bronze')) {
                    obj.image = '/zjhnzs.webp';
                } else if (lowerTitle.includes('poterie') || lowerTitle.includes('zangbéto') || lowerTech.includes('ceramique') || lowerTech.includes('vannerie')) {
                    obj.image = '/masque.webp';
                } else if (lowerTitle.includes('cauris') || lowerTech.includes('cauris')) {
                    obj.image = '/masque2.webp';
                } else if (lowerTitle.includes('tissu') || lowerTitle.includes('costume') || lowerTech.includes('textile')) {
                    obj.image = '/sCULPTURE BOIS2.webp';
                } else if (lowerTitle.includes('récade')) {
                    obj.image = '/sCULPTURE BOIS2.webp';
                } else if (lowerTitle.includes('statue') || lowerTitle.includes('sculpture') || lowerTech.includes('bois')) {
                    obj.image = '/sCULPTURE BOIS.webp';
                } else {
                    const idNum = parseInt(obj.id, 10);
                    const idx = isNaN(idNum) ? count++ : idNum;
                    obj.image = webpImages[idx % webpImages.length];
                }
            }
        };

        if (Array.isArray(response.data)) {
            response.data.forEach(replaceImage);
        } else if (response.data && response.data.id) {
            replaceImage(response.data);
            if (response.data.photos) {
                response.data.photos.forEach((p, idx) => {
                    p.image = webpImages[(idx + 6) % webpImages.length];
                });
            }
        }
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Jeton invalide (BD effacée ?). Déconnexion...");
      localStorage.removeItem('token');
      localStorage.removeItem('artisanId');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
