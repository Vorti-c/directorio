// Función para obtener los datos de localStorage de manera segura
const getDatos = (key) => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(`Error al cargar los datos de ${key}:`, error);
    return [];
  }
};

// Cargar los datos desde localStorage
const datos = {
  clientes: getDatos("clientes"),
  vendedores: getDatos("vendedores"),
  proveedores: getDatos("proveedores"),
  comisionistas: getDatos("comisionistas"),
};

// Actualizar estadísticas en el Dashboard
function actualizarEstadisticas() {
  Object.keys(datos).forEach((tipo) => {
    const elemento = document.getElementById(`${tipo}Total`);
    if (elemento) {
      elemento.innerText = datos[tipo].length;
    }
  });
}

// Guardar datos en localStorage
function guardarDatos(tipo, nuevoRegistro) {
  if (datos[tipo].some((registro) => registro.nombre === nuevoRegistro.nombre)) {
    alert("Este registro ya existe.");
    return;
  }

  datos[tipo].push(nuevoRegistro);
  localStorage.setItem(tipo, JSON.stringify(datos[tipo]));
  datos[tipo] = getDatos(tipo); // Recargar datos desde localStorage

  actualizarEstadisticas();
  mostrarMensajeExito(`${capitalizeFirstLetter(tipo)} guardado exitosamente!`, tipo);
  mostrarRegistros(tipo);

  // Limpiar formulario
  document.getElementById(`${tipo}Form`).reset();
}

// Mostrar mensaje de éxito
function mostrarMensajeExito(mensaje, tipo) {
  const mensajeExito = document.getElementById(`mensajeExito${capitalizeFirstLetter(tipo)}`);
  if (!mensajeExito) {
    console.error(`Elemento mensajeExito${capitalizeFirstLetter(tipo)} no encontrado.`);
    return;
  }

  mensajeExito.innerText = mensaje;
  mensajeExito.style.display = "block";
  setTimeout(() => mensajeExito.style.display = "none", 3000);
}

// Capitalizar la primera letra
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Mostrar registros en la tabla
function mostrarRegistros(tipo) {
  const registrosBody = document.getElementById("registrosBody");
  const registrosTable = document.getElementById("registrosTable");
  const mensajeNoRegistros = document.getElementById("mensajeNoRegistros");

  if (!registrosBody || !registrosTable || !mensajeNoRegistros) return;

  registrosBody.innerHTML = "";
  const registros = datos[tipo];

  if (registros.length > 0) {
    registros.forEach((registro, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${registro.nombre}</td>
        <td>${registro.email || 'N/A'}</td>
        <td>${registro.telefono || 'N/A'}</td>
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

    const nombre = document.getElementById(`${tipo}Nombre`).value;
    const email = document.getElementById(`${tipo}TelefonoCorreo`).value; // Usa el campo correcto
    const telefono = document.getElementById(`${tipo}TelefonoCorreo`).value;

    if (nombre && email) {
      guardarDatos(tipo, { nombre, email, telefono });
    } else {
      alert("Por favor, complete todos los campos.");
    }
  });
});

// Cargar estadísticas al inicio
actualizarEstadisticas();
