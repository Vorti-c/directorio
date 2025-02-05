// Función para obtener los datos de localStorage de manera segura
const getDatos = (key) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];  // Devuelve un array vacío si no hay datos
  } catch (error) {
    console.error(`Error al cargar los datos de ${key}:`, error);
    return []; // En caso de error, retorna un array vacío
  }
};

// Almacenamiento de los datos
const datos = {
  clientes: getDatos("clientes"),
  vendedores: getDatos("vendedores"),
  proveedores: getDatos("proveedores"),
  comisionistas: getDatos("comisionistas"),
};

// Actualiza las estadísticas del Dashboard
function actualizarEstadisticas() {
  Object.keys(datos).forEach((tipo) => {
    const elemento = document.getElementById(`${tipo}Total`);
    if (elemento) {
      elemento.innerText = datos[tipo].length; // Muestra la cantidad de registros
    }
  });
}

// Función para cerrar sesión
function cerrarSesion() {
  if (confirm("¿Estás seguro/a de que deseas cerrar sesión?")) {
    localStorage.removeItem("usuario"); // Borra datos del usuario en localStorage
    // Redirigir al login con ruta relativa
    window.location.href = "/directorio/index.html"; // Usar la ruta correcta a index.html
  }
}

// Función para guardar los datos en localStorage
function guardarDatos(tipo, nuevoRegistro) {
  const existeRegistro = datos[tipo].some((registro) => registro.email === nuevoRegistro.email);
  if (existeRegistro) {
    alert("Este registro ya existe.");
    return;
  }

  datos[tipo].push({ ...nuevoRegistro }); // Añadir el nuevo registro
  localStorage.setItem(tipo, JSON.stringify(datos[tipo]));
  actualizarEstadisticas();
  mostrarMensajeExito(`${capitalizeFirstLetter(tipo)} guardado exitosamente!`, tipo);

  // Limpiar el formulario después de guardar
  const form = document.getElementById(`${tipo}Form`);
  if (form) {
    form.reset();
  }

  // Actualiza la tabla de registros después de guardar
  mostrarRegistros(tipo);
}

// Función para mostrar el mensaje de éxito
function mostrarMensajeExito(mensaje, tipo) {
  const mensajeExito = document.getElementById(`mensajeExito${capitalizeFirstLetter(tipo)}`);
  if (!mensajeExito) {
    console.error(`Elemento mensajeExito${capitalizeFirstLetter(tipo)} no encontrado.`);
    return;
  }

  mensajeExito.innerText = mensaje;
  mensajeExito.style.display = "block"; // Mostrar el mensaje de éxito

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    mensajeExito.style.display = "none";
  }, 3000);
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Muestra los registros según la categoría seleccionada
function mostrarRegistros(tipo) {
  const registrosBody = document.getElementById("registrosBody");
  const registrosTable = document.getElementById("registrosTable");
  const mensajeNoRegistros = document.getElementById("mensajeNoRegistros");

  if (!registrosBody || !registrosTable || !mensajeNoRegistros) {
    console.error("Elementos de tabla no encontrados.");
    return;
  }

  registrosBody.innerHTML = ""; // Limpiar contenido previo
  const registros = datos[tipo];

  if (registros.length > 0) {
    registros.forEach((registro, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${registro.nombre}</td>
        <td>${registro.email}</td>
        <td>${registro.telefono}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="eliminarRegistro('${tipo}', ${index})">Eliminar</button>
        </td>
      `;
      registrosBody.appendChild(row);
    });
    registrosTable.style.display = "table";
    mensajeNoRegistros.style.display = "none";
  } else {
    registrosTable.style.display = "none";
    mensajeNoRegistros.style.display = "block";
  }
}

// Función para eliminar un registro
function eliminarRegistro(tipo, index) {
  const confirmar = confirm("¿Estás seguro de eliminar este registro?");
  if (confirmar) {
    // Eliminar el registro
    datos[tipo].splice(index, 1);
    localStorage.setItem(tipo, JSON.stringify(datos[tipo]));
    actualizarEstadisticas();
    mostrarMensajeExito(`${capitalizeFirstLetter(tipo)} eliminado correctamente`, tipo);
    mostrarRegistros(tipo);
  }
}

// Función para exportar a Excel
function exportarAExcel(tipo) {
  const registros = datos[tipo];
  const rows = [];

  // Cabecera
  rows.push(["ID", "Nombre", "Email", "Teléfono"]);

  // Datos de los registros
  registros.forEach((registro, index) => {
    rows.push([index + 1, registro.nombre, registro.email, registro.telefono]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tipo);

  // Crear archivo Excel y descargar
  XLSX.writeFile(workbook, `${capitalizeFirstLetter(tipo)}_Registros.xlsx`);
}

// Manejo de navegación del menú
const menuItems = {
  menuInicio: "welcomeMessage",
  menuClientes: "formClientes",
  menuVendedores: "formVendedores",
  menuProveedores: "formProveedores",
  menuComisionistas: "formComisionistas",
  menuDashboard: "dashboard",
  menuRegistros: "tableRegistros",
};

for (const menuItemId in menuItems) {
  const menuButton = document.getElementById(menuItemId);
  if (!menuButton) continue;

  menuButton.addEventListener("click", () => {
    for (const itemId in menuItems) {
      document.getElementById(menuItems[itemId]).style.display = "none";
    }
    document.getElementById(menuItems[menuItemId]).style.display = "block";

    if (menuItemId === "menuDashboard") {
      actualizarEstadisticas();
    } else if (menuItemId === "menuRegistros") {
      document.getElementById("categoriaSelect").value = "clientes";
      mostrarRegistros("clientes");
    }
  });
}

// Manejo del dropdown de registros
document.getElementById("consultarRegistrosBtn")?.addEventListener("click", () => {
  const categoria = document.getElementById("categoriaSelect").value;
  mostrarRegistros(categoria);
});

// Manejo de formularios
const formularios = [
  { id: "clientesForm", tipo: "clientes" },
  { id: "vendedoresForm", tipo: "vendedores" },
  { id: "proveedoresForm", tipo: "proveedores" },
  { id: "comisionistasForm", tipo: "comisionistas" },
];

formularios.forEach(({ id, tipo }) => {
  const form = document.getElementById(id);
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.querySelector(`#${id} input[name="nombre"]`).value;
    const email = document.querySelector(`#${id} input[name="email"]`).value;
    const telefono = document.querySelector(`#${id} input[name="telefono"]`).value;

    if (nombre && email && telefono) {
      guardarDatos(tipo, { nombre, email, telefono });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  });
});

// Función para descargar registros con estilos
document.getElementById("descargarRegistrosBtn").addEventListener("click", descargarRegistros);

function descargarRegistros() {
  const categoria = document.getElementById("categoriaSelect").value;
  const table = document.getElementById("registrosTable");
  const registros = [];

  if (table.style.display === "none" || !table.querySelector("tbody").rows.length) {
    alert("No hay registros disponibles para descargar.");
    return;
  }

  const rows = table.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const cells = Array.from(row.children).map((cell) => cell.textContent);
    registros.push(cells);
  });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([["#", "Nombre", "Email", "Teléfono"], ...registros]);

  worksheet["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 40 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(workbook, worksheet, `Registros_${categoria}`);
  XLSX.writeFile(workbook, `Registros_${categoria}.xlsx`);
}

// Manejo del botón de Cerrar sesión
document.getElementById("logoutButton")?.addEventListener("click", cerrarSesion);
