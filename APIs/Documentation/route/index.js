const DocumentationRoute = require('./DocumentationRoute');

module.exports = [
  { method: 'POST', path: '/document/list', options: DocumentationRoute.find },
  { method: 'POST', path: '/document/create', options: DocumentationRoute.insert },
  { method: 'PUT', path: '/document/update', options: DocumentationRoute.update },
  { method: 'POST', path: '/document/detail', options: DocumentationRoute.detail },
];