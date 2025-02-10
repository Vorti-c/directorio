document.addEventListener("DOMContentLoaded", function () {
    // 🌟 Menú de navegación
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

    // 🌟 Mostrar mensajes de éxito/error
    function mostrarMensaje(id) {
        const mensaje = document.getElementById(id);
        mensaje.style.display = "block";
        setTimeout(() => (mensaje.style.display = "none"), 3000);
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

        // Mensaje de éxito y actualizar tabla
        mostrarMensaje(`mensajeExito${capitalize(categoria)}`);
        actualizarDashboard();
        consultarRegistros();
    }

    // 🌟 Capitalizar
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 🌟 Manejo de formularios
    document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const categoria = this.id.replace("Form", "").toLowerCase();

            const registro = {};
            this.querySelectorAll("input, select, textarea").forEach((input) => {
                registro[input.name] = input.value;
            });

            guardarRegistro(categoria, registro);
            this.reset();
        });
    });

    // 🌟 Consultar Registros
    function consultarRegistros() {
        const categoria = document.getElementById("categoriaSelect").value;
        const registros = JSON.parse(localStorage.getItem(categoria)) || [];
        const tbody = document.getElementById("registrosBody");
        const tabla = document.getElementById("registrosTable");
        const mensajeNoRegistros = document.getElementById("mensajeNoRegistros");

        tbody.innerHTML = "";

        if (registros.length === 0) {
            mensajeNoRegistros.style.display = "block";
            tabla.style.display = "none";
            return;
        }

        mensajeNoRegistros.style.display = "none";
        tabla.style.display = "table";

        registros.forEach((registro, index) => {
            let row = tbody.insertRow();
            row.insertCell(0).innerText = index + 1;
            row.insertCell(1).innerText = registro.nombre || "N/A";
            row.insertCell(2).innerText = registro.email || "N/A";
            row.insertCell(3).innerText = registro.telefono || "N/A";

            // 🌟 Celda de Acciones (Botón Editar y Eliminar juntos)
            let actionsCell = row.insertCell(4);
            actionsCell.innerHTML = `
                <button class="btn-edit" onclick="editarRegistro('${categoria}', ${index})">✏️ Editar</button>
                <button class="btn-delete" onclick="eliminarRegistro('${categoria}', ${index})">🗑️ Eliminar</button>
            `;
        });
    }

    document.getElementById("consultarRegistrosBtn").addEventListener("click", consultarRegistros);

    // 🌟 Editar Registro
    window.editarRegistro = function (categoria, index) {
        let registros = JSON.parse(localStorage.getItem(categoria)) || [];
        let registro = registros[index];

        let nuevoNombre = prompt("Editar nombre:", registro.nombre);
        let nuevoEmail = prompt("Editar Email:", registro.email);
        let nuevoTelefono = prompt("Editar Teléfono:", registro.telefono);

        if (nuevoNombre && nuevoEmail && nuevoTelefono) {
            registros[index] = {
                ...registro,
                nombre: nuevoNombre,
                email: nuevoEmail,
                telefono: nuevoTelefono,
            };

            localStorage.setItem(categoria, JSON.stringify(registros));
            consultarRegistros();
            actualizarDashboard();
        }
    };

    // 🌟 Eliminar Registro
    window.eliminarRegistro = function (categoria, index) {
        let registros = JSON.parse(localStorage.getItem(categoria)) || [];
        if (confirm("¿Estás seguro de eliminar este registro?")) {
            registros.splice(index, 1);
            localStorage.setItem(categoria, JSON.stringify(registros));
            consultarRegistros();
            actualizarDashboard();
        }
    };

    // 🌟 Descargar Registros en Excel
    document.getElementById("descargarRegistrosBtn").addEventListener("click", function () {
        const categoria = document.getElementById("categoriaSelect").value;
        const registros = JSON.parse(localStorage.getItem(categoria)) || [];

        if (registros.length === 0) {
            alert("No hay registros para exportar.");
            return;
        }

        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.json_to_sheet(registros);
        XLSX.utils.book_append_sheet(wb, ws, categoria);
        XLSX.writeFile(wb, `${categoria}_registros.xlsx`);
    });

    // 🌟 Actualizar Dashboard
    function actualizarDashboard() {
        ["clientes", "vendedores", "proveedores", "comisionistas"].forEach((categoria) => {
            document.getElementById(`${categoria}Total`).innerText = (JSON.parse(localStorage.getItem(categoria)) || []).length;
        });
    }

    // Llamar al dashboard al inicio
    actualizarDashboard();
});
