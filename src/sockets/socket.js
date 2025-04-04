let io;

function setupSocket(server) {
    const { Server } = require('socket.io');
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "DELETE"]
        }
    });

    io.on('connection', (socket) => {
        console.log('🔌 Cliente conectado');

        socket.on('disconnect', () => {
            console.log('❌ Cliente desconectado');
        });
    });
}

function emitirActualizacionTabla(data = {}) {
    if (io) io.emit('tabla-actualizada', data);
}

module.exports = {
    setupSocket,
    emitirActualizacionTabla
};
