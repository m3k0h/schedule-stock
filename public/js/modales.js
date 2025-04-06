function modificarStock(stock, id) {
    document.getElementById("modificarStock").value = stock;
    document.getElementById("modalStock").setAttribute("data-id", id);
    document.getElementById("modalStock").style.display = "flex";
}

function agregarDroga() {
    document.getElementById("modalAgregar").style.display = "flex";
}

document.getElementById("closeModal").addEventListener("click", function () {
    document.getElementById("modalStock").style.display = "none";
    document.getElementById("modalAgregar").style.display = "none";
});

document.getElementById("closeAgregarDroga").addEventListener("click", function () {
    document.getElementById("modalAgregar").style.display = "none";
});
