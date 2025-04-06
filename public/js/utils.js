function mostrarNoti(texto, tipo = 'exito') {
    const noti = document.getElementById('notificacion');
    noti.textContent = texto;

    if (tipo === 'error') {
        noti.style.color = '#e74c3c';
    } else if (tipo === 'info') {
        noti.style.color = '#3498db';
    } else {
        noti.style.color = '#2ecc71';
    }

    noti.classList.remove('oculto');

    setTimeout(() => {
        noti.classList.add('oculto');
    }, 3000);
}
