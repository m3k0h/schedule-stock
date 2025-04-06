document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tbDrogas");

    tabla.addEventListener("click", function (e) {
        if (e.target && e.target.classList.contains("menu-button")) {
            const boton = e.target;
            e.stopPropagation();
            const contenedor = boton.closest(".menu-container");

            document.querySelectorAll(".menu-container").forEach(mc => {
                if (mc !== contenedor) mc.classList.remove("active");
            });

            contenedor.classList.toggle("active");
        }
    });
});

document.addEventListener("click", () => {
    document.querySelectorAll(".menu-container").forEach(mc => {
        mc.classList.remove("active");
    });
});
