document.getElementById("modalAgregar").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreDroga").value;
    const stock = parseInt(document.getElementById("cantStock").value);

    try {
        const response = await fetch("/api/droga/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, stock })
        });

        const data = await response.json();
        if (response.ok) {
            mostrarNoti(data.message, "info");
            document.getElementById("modalAgregar").style.display = "none";
            await cargarDrogas();
        } else {
            console.error("Error al crear droga:", data.error);
            mostrarNoti("Error al crear droga", "error");
            document.getElementById("modalAgregar").style.display = "none";
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        mostrarNoti('Error en la solicitud, contacta con el dev.', "error");
        document.getElementById("modalAgregar").style.display = "none";
    }

    document.getElementById("nombreDroga").value = "";
    document.getElementById("cantStock").value = "";
});

async function eliminarDroga(id) {
    if (!confirm("¿Estás seguro wachinaso?")) return;

    try {
        const response = await fetch(`/api/droga/eliminar/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (response.ok) {
            mostrarNoti(data.message, "info");
            await cargarDrogas();
        } else {
            console.error("Error al eliminar droga:", data.error);
            mostrarNoti("Error al eliminar droga", "error");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        mostrarNoti('Error en la solicitud, contacta con el dev.', "error");
    }
}

async function cargarDrogas() {
    const tbody = document.getElementById("tbDrogas");
    tbody.innerHTML = '';

    try {
        const response = await fetch("/api/droga/drugs", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (response.ok) {
            data.forEach(d => {
                tbody.innerHTML += `
                    <tr data-id="${d.id}">
                        <td>${d.id}</td>
                        <td class="arrNombre">${d.nombre}</td>
                        <td id="quantityStock" data-id:"${d.id}">${d.stock}</td>
                        <td>
                            <button class="optButton btnSumar" onclick="sumarStock(${d.id}, ${d.stock})">▲</button>
                            <button class="optButton btnRestar" onclick="restarStock(${d.id}, ${d.stock})">▼</button>
                            <div class="menu-container">
                                <button class="menu-button">⋮</button>
                                <div class="dropdown">
                                    <a href="#" onclick="modificarStock(${d.stock}, ${d.id})">Editar</a>
                                    <a href="#" onclick="eliminarDroga(${d.id})">Eliminar</a>
                                </div>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            console.error("Error al cargar el stock:", data.error);
            alert("Error al cargar el stock");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
