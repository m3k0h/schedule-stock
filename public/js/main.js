window.addEventListener("load", async function() {
    document.getElementById("modalStock").style.display = "none";
    document.getElementById("modalAgregar").style.display = "none";
    await cargarDrogas();
});
