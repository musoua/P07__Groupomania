/********************************* configuration de SERVER CONFIGURATION *************************************/

/* importer node HTTP package */
const http = require('http');

/* importer l'application express */
const app = require('./app');

/* création de la fonction normalizePort qui renvoie un port valide, qu'il soit fourni sous forme de nombre ou de chaîne */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/* création de la fonction errorhandler qui vérifie et gére les erreurs de maniére appropriée */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/* Création d'un serveur à l'aide de la méthode createServer à partir du package http du nœud et définition de l'application express en tant que paramètre */
const server = http.createServer(app);

/* Enregistrement de la fonction errorHandler dans le serveur */
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('----------------------------------------');
  console.log('Listening on ' + bind);
  console.log('----------------------------------------');
});

/* utiliser la méthode listen pour créer un serveur qui écoute sur le port défini */
server.listen(port);