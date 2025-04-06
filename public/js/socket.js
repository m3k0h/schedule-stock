const socket = io('http://18.229.141.107:4000');

socket.on('tabla-actualizada', async (data) => {
    console.log("🔁 Cambio detectado:", data);
    await cargarDrogas(); // Refresca la tabla
});
