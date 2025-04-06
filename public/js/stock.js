async function restarStock(id, stock) {
    const cantidad = parseInt(stock) - 1;
    await actualizarStock(id, cantidad, "Stock actualizado -1");
}

async function sumarStock(id, stock) {
    const cantidad = parseInt(stock) + 1;
    await actualizarStock(id, cantidad, "Stock actualizado +1");
}

async function actualizarStock(id, cantidad, mensaje) {
    try {
        const response = await fetch("/api/droga/reponer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, cantidad })
        });

        const data = await response.json();
        if (response.ok) {
            mostrarNoti(mensaje, "info");
            await cargarDrogas();
        } else {
            console.error("Error al actualizar stock:", data.error);
            mostrarNoti("Error al actualizar stock", "error");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

document.getElementById("formActualizarStock").addEventListener("submit", async function(event) {
    event.preventDefault();
    const id = document.getElementById("modalStock").getAttribute("data-id");
    const cantidad = parseInt(document.getElementById("modificarStock").value);
    await actualizarStock(id, cantidad, "Stock actualizado correctamente");
    document.getElementById("modalStock").style.display = "none";
});
