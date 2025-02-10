document.addEventListener("DOMContentLoaded", function () {
    // 🌟 Manejadores del menú
    const menuItems = {
        menuInicio: "welcomeMessage",
        menuDashboard: "dashboard",
        menuClientes: "formClientes",
        menuVendedores: "formVendedores",
        menuProveedores: "formProveedores",
        menuComisionistas: "formComisionistas",
        menuRegistros: "tableRegistros",
    };

    Object.keys(menuItems).forEach((id) => {
        document.getElementById(id)?.addEventListener("click", () => {
            Object.values(menuItems).forEach((view) => document.getElementById(view).style.display = "none");
            document.getElementById(menuItems[id]).style.display = "block";
        });
    });

    // 🌟 Función para mostrar mensajes de éxito/error
    function mostrarMensaje(id) {
        const mensaje = document.getElementById(id);
        mensaje.classList.add("show"); 
        setTimeout(() => mensaje.classList.remove("show"), 3000);
    }

    // 🌟 Guardar Registros en localStorage
    function guardarRegistro(categoria, registro) {
        let registros = JSON.parse(localStorage.getItem(categoria)) || [];

        // Verificar si ya existe
        if (registros.some((r) => r.nombre === registro.nombre)) {
            mostrarMensaje(`mensajeError${capitalize(categoria)}`);
            return;
        }

        // Guardar en localStorage
        registros.push(registro);
        localStorage.setItem(categoria, JSON.stringify(registros));

        // Mensaje de éxito y actualizar dashboard
        mostrarMensaje(`mensajeExito${capitalize(categoria)}`);
        actualizarDashboard();
    }

    // 🌟 Función para Capitalizar
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 🌟 Agregar eventos a todos los formularios dinámicamente
    document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const categoria = this.dataset.categoria;

            const registro = {};
            this.querySelectorAll("input, select, textarea").forEach((input) => {
                registro[input.id] = input.value;
            });

            guardarRegistro(categoria, registro);
            this.reset();
        });
    });

    // 🌟 Consultar Registros
    document.getElementById("consultarRegistrosBtn").addEventListener("click", function () {
        const categoria = document.getElementById("categoriaSelect").value;
        const registros = JSON.parse(localStorage.getItem(categoria)) || [];
        const tabla = document.getElementById("registrosTable");
        const tbody = document.getElementById("registrosBody");
        tbody.innerHTML = "";

        if (registros.length === 0) {
            mostrarMensaje("mensajeNoRegistros");
            tabla.style.display = "none";
            return;
        }

        tabla.style.display = "block";
        registros.forEach((registro, index) => {
            let row = tbody.insertRow();
            row.insertCell(0).innerText = index + 1;
            row.insertCell(1).innerText = registro.nombre;
            row.insertCell(2).innerText = registro.telefonoCorreo || "-";
            row.insertCell(3).innerText = registro.identificacionFiscal || "-";
        });
    });


