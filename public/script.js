document.getElementById("formActualizarStock").addEventListener("submit", async function(event) {
    event.preventDefault();

    const id = document.getElementById("modalStock").getAttribute("data-id"); // Corregido
    const cantidad = parseInt(document.getElementById("modificarStock").value);

    try {
        const response = await fetch("/reponer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, cantidad })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Stock actualizado:", data.stockActualizado);
            alert("Stock actualizado correctamente");
            document.getElementById("modalStock").style.display = "none";
            await cargarDrogas();
        } else {
            console.error("Error al actualizar stock:", data.error);
            alert("Error al actualizar stock");
            document.getElementById("modalStock").style.display = "none";
            await cargarDrogas();
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById("modalStock").style.display = "none";
        await cargarDrogas();
    }
});

document.getElementById("modalAgregar").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreDroga").value; // Corregido
    const stock = parseInt(document.getElementById("cantStock").value);

    try {
        const response = await fetch("/crear", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre, stock })
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data.message + " | ID: " + data.id);
            alert(data.message);
            document.getElementById("modalAgregar").style.display = "none";
            await cargarDrogas();
        } else {
            console.error("Error al crear droga:", data.error);
            alert("Error al crear droga");
            document.getElementById("modalAgregar").style.display = "none";
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        document.getElementById("modalAgregar").style.display = "none";
    }
    document.getElementById("nombreDroga").value = ""
    document.getElementById("cantStock").value = ""
});

async function eliminarDroga(id){
    if(!confirm("Estas seguro wachinaso?")) return;
    try {
        const response = await fetch(`/eliminar/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const data = await response.json();
        if (response.ok) {
            console.log(data.message + " | ID: " + data.id);
            alert(data.message);
            await cargarDrogas();
        } else {
            console.error("Error al eliminar droga:", data.error);
            alert("Error al eliminar droga");
            await cargarDrogas();
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        await cargarDrogas();
    }
}

function modificarStock(stock, id){
    document.getElementById("modificarStock").value = stock;
    document.getElementById("modalStock").setAttribute("data-id", id);
    document.getElementById("modalStock").style.display = "flex";
}

function agregarDroga(){
    document.getElementById("modalAgregar").style.display = "flex";
}

document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("modalStock").style.display = "none";
    document.getElementById("modalAgregar").style.display = "none";
});

document.getElementById("closeAgregarDroga").addEventListener("click", function() {
    document.getElementById("modalAgregar").style.display = "none";
});

async function cargarDrogas(){
    tbody = document.getElementById("tbDrogas")
    tbody.innerHTML = ''

    try {
        const response = await fetch("/drugs", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        const data = await response.json();
        if (response.ok) {
            data.forEach(d => {
                tbody.innerHTML += `
                <tr data-id="${d.id}">
                <td>${d.id}</td>
                <td class="arrNombre">${d.nombre}</td>
                <td>${d.stock}</td>
                <td><button class="optButton btnModificarStock" onclick="modificarStock(${d.stock},${d.id})">✏️</button> <button class="optButton btnEliminar" onclick="eliminarDroga(${d.id})">✕</button></td>
            </tr>
                `
            });
            console.log("Stock actualizado:", data);
        } else {
            console.error("Error al actualizar la tabla:", data.error);
            alert("Error al cargar el stock");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }

}

window.addEventListener("load", async function(){
    document.getElementById("modalStock").style.display = "none";
    document.getElementById("modalAgregar").style.display = "none";
    await cargarDrogas();
})