document.getElementById("formSubirArchivo").addEventListener("submit", async function(event) {
    event.preventDefault();

    const data = new FormData(this);
    try {
        const response = await fetch("/api/droga/upload", {
            method: "POST",
            body: data
        });

        const json = await response.json();
        if (response.ok) {
            mostrarNoti(json.archivo + ' | ' + json.mensaje, "info");
        } else {
            console.error("Error al intentar subir el archivo:", json.error);
            mostrarNoti("Error al intentar subir el archivo", "error");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        mostrarNoti('Error en la solicitud, contacta con el dev.', "error");
    }
});
