// =========================
// 🔌 CONEXIÓN SOCKET.IO
// =========================
const socket = io('http://18.229.141.107:4000');
console.log("Conectado al socket");

socket.on('tabla-actualizada', async (data) => {
    console.log("🔁 Cambio detectado:", data);
    await cargarDrogas(); // Refresca la tabla
});

// =========================
// 🧾 EVENTOS DE FORMULARIOS
// =========================

// 📦 Actualizar Stock
document.getElementById("formActualizarStock").addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("modalStock").getAttribute("data-id");
    const cantidad = parseInt(document.getElementById("modificarStock").value);

    try {
        const response = await fetch("/reponer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, cantidad })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Stock actualizado correctamente");
            document.getElementById("modalStock").style.display = "none";
        } else {
            console.error("Error al actualizar stock:", data.error);
            alert("Error al actualizar stock");
            document.getElementById("modalStock").style.display = "none";
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById("modalStock").style.display = "none";
    }
});

// ➕ Agregar Droga
document.getElementById("modalAgregar").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreDroga").value;
    const stock = parseInt(document.getElementById("cantStock").value);

    try {
        const response = await fetch("/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, stock })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            document.getElementById("modalAgregar").style.display = "none";
        } else {
            console.error("Error al crear droga:", data.error);
            alert("Error al crear droga");
            document.getElementById("modalAgregar").style.display = "none";
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById("modalAgregar").style.display = "none";
    }

    document.getElementById("nombreDroga").value = "";
    document.getElementById("cantStock").value = "";
});

// =========================
// ❌ ELIMINAR DROGA
// =========================
async function eliminarDroga(id) {
    if (!confirm("¿Estás seguro wachinaso?")) return;

    try {
        const response = await fetch(`/eliminar/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
        } else {
            console.error("Error al eliminar droga:", data.error);
            alert("Error al eliminar droga");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// =========================
// ✏️ MODIFICAR STOCK
// =========================
function modificarStock(stock, id) {
    document.getElementById("modificarStock").value = stock;
    document.getElementById("modalStock").setAttribute("data-id", id);
    document.getElementById("modalStock").style.display = "flex";
}

// =========================
// ➕ MOSTRAR MODAL AGREGAR
// =========================
function agregarDroga() {
    document.getElementById("modalAgregar").style.display = "flex";
}

// =========================
// ❌ CERRAR MODALES
// =========================
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("modalStock").style.display = "none";
    document.getElementById("modalAgregar").style.display = "none";
});

document.getElementById("closeAgregarDroga").addEventListener("click", function() {
    document.getElementById("modalAgregar").style.display = "none";
});

// =========================
// 📥 CARGAR TABLA DROGAS
// =========================
async function cargarDrogas() {
    const tbody = document.getElementById("tbDrogas");
    tbody.innerHTML = '';

    try {
        const response = await fetch("/drugs", {
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
                        <td>${d.stock}</td>
                        <td>
                            <button class="optButton btnModificarStock" onclick="modificarStock(${d.stock}, ${d.id})">✏️</button>
                            <button class="optButton btnEliminar" onclick="eliminarDroga(${d.id})">✕</button>
                        </td>
                    </tr>
                `;
            });
            console.log("Stock actualizado:", data);
        } else {
            console.error("Error al cargar el stock:", data.error);
            alert("Error al cargar el stock");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// =========================
// 🚀 INICIALIZACIÓN
// =========================
window.addEventListener("load", async function() {
    document.getElementById("modalStock").style.display = "none";
    document.getElementById("modalAgregar").style.display = "none";
    await cargarDrogas();
});
