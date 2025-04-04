require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { setupSocket } = require('./src/sockets/socket');

const server = http.createServer(app);
setupSocket(server);

const PORT = process.env.PORT || 4000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
