import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const newsletterAPI = {
  // Subscribers
  getSubscribers: () => api.get('/subscribers'),
  addSubscriber: (subscriber) => api.post('/subscribers', subscriber),
  deleteSubscriber: (email) => api.delete(`/subscribers/${email}`),
  exportSubscribers: () => api.get('/subscribers/export', { responseType: 'blob' }),

  // Newsletters
  getNewsletters: () => api.get('/newsletters'),
  addNewsletter: (newsletter) => api.post('/newsletters', newsletter),
  deleteNewsletter: (id) => api.delete(`/newsletters/${id}`),
};

export default api;
