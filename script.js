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

    // 🌟 Guardar Registros en localStorage
    function guardarRegistro(categoria, registro) {
        let registros = JSON.parse(localStorage.getItem(categoria)) || [];

        // Verificar si ya existe
        if (registros.some((r) => r.nombre === registro.nombre)) {
            document.getElementById(`mensajeError${capitalize(categoria)}`).style.display = "block";
            setTimeout(() => {
                document.getElementById(`mensajeError${capitalize(categoria)}`).style.display = "none";
            }, 3000);
            return;
        }

        // Guardar en localStorage
        registros.push(registro);
        localStorage.setItem(categoria, JSON.stringify(registros));

        // Mensaje de éxito
        document.getElementById(`mensajeExito${capitalize(categoria)}`).style.display = "block";
        setTimeout(() => {
            document.getElementById(`mensajeExito${capitalize(categoria)}`).style.display = "none";
        }, 3000);
    }

    // 🌟 Función para Capitalizar (Clientes → Clientes)
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // 🌟 Eventos para guardar registros
    document.getElementById("clientesForm").addEventListener("submit", function (e) {
        e.preventDefault();
        guardarRegistro("clientes", {
            nombre: document.getElementById("clienteNombre").value,
            tipo: document.getElementById("tipoCliente").value,
            domicilio: document.getElementById("clienteDomicilio").value,
            telefonoCorreo: document.getElementById("clienteTelefonoCorreo").value,
            identificacionFiscal: document.getElementById("clienteIdentificacionFiscal").value,
            formaPago: document.getElementById("clienteFormaPago").value,
            condicionesCredito: document.getElementById("clienteCondicionesCredito").value,
        });
        this.reset();
    });

    document.getElementById("vendedoresForm").addEventListener("submit", function (e) {
        e.preventDefault();
        guardarRegistro("vendedores", {
            nombre: document.getElementById("vendedorNombre").value,
            identificacion: document.getElementById("vendedorIdentificacion").value,
            direccion: document.getElementById("vendedorDireccion").value,
            telefonoCorreo: document.getElementById("vendedorTelefonoCorreo").value,
            contrato: document.getElementById("vendedorContrato").value,
            formaPagoComision: document.getElementById("vendedorFormaPagoComision").value,
        });
        this.reset();
    });

    document.getElementById("proveedoresForm").addEventListener("submit", function (e) {
        e.preventDefault();
        guardarRegistro("proveedores", {
            nombre: document.getElementById("proveedorNombre").value,
            identificacionFiscal: document.getElementById("proveedorIdentificacionFiscal").value,
            domicilio: document.getElementById("proveedorDomicilio").value,
            telefonoCorreo: document.getElementById("proveedorTelefonoCorreo").value,
            cuentaBancaria: document.getElementById("proveedorCuentaBancaria").value,
            catalogo: document.getElementById("proveedorCatalogo").value,
            terminosPago: document.getElementById("proveedorTerminosPago").value,
        });
        this.reset();
    });

    document.getElementById("comisionistasForm").addEventListener("submit", function (e) {
        e.preventDefault();
        guardarRegistro("comisionistas", {
            nombre: document.getElementById("comisionistaNombre").value,
            identificacion: document.getElementById("comisionistaIdentificacion").value,
            direccion: document.getElementById("comisionistaDireccion").value,
            telefonoCorreo: document.getElementById("comisionistaTelefonoCorreo").value,
            comision: document.getElementById("comisionistaComision").value,
            bancoCuenta: document.getElementById("comisionistaBancoCuenta").value,
        });
        this.reset();
    });

    // 🌟 Consultar Registros
    document.getElementById("consultarRegistrosBtn").addEventListener("click", function () {
        const categoria = document.getElementById("categoriaSelect").value;
        const registros = JSON.parse(localStorage.getItem(categoria)) || [];
        const tabla = document.getElementById("registrosTable");
        const tbody = document.getElementById("registrosBody");
        tbody.innerHTML = "";

        if (registros.length === 0) {
            document.getElementById("mensajeNoRegistros").style.display = "block";
            tabla.style.display = "none";
            return;
        } else {
            document.getElementById("mensajeNoRegistros").style.display = "none";
            tabla.style.display = "block";
        }

        registros.forEach((registro, index) => {
            let row = tbody.insertRow();
            row.insertCell(0).innerText = index + 1;
            row.insertCell(1).innerText = registro.nombre;
            row.insertCell(2).innerText = registro.telefonoCorreo || "-";
            row.insertCell(3).innerText = registro.identificacionFiscal || "-";
        });
    });

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
        document.getElementById("clientesTotal").innerText = (JSON.parse(localStorage.getItem("clientes")) || []).length;
        document.getElementById("vendedoresTotal").innerText = (JSON.parse(localStorage.getItem("vendedores")) || []).length;
        document.getElementById("proveedoresTotal").innerText = (JSON.parse(localStorage.getItem("proveedores")) || []).length;
        document.getElementById("comisionistasTotal").innerText = (JSON.parse(localStorage.getItem("comisionistas")) || []).length;
    }

    // Llamar al dashboard al inicio
    actualizarDashboard();
});
