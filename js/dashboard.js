"use strict";

const estadosAula = {
  0: {
    nombre: "Silencio",
    descripcion:
      "El nivel acústico se encuentra dentro del intervalo adecuado.",
    clase: "estado-silencio",
    icono: "bi-check-circle-fill",
  },
  1: {
    nombre: "Normal",
    descripcion: "El nivel acústico del aula es moderado.",
    clase: "estado-normal",
    icono: "bi-info-circle-fill",
  },
  2: {
    nombre: "Ruido",
    descripcion: "El nivel acústico se aproxima al límite establecido.",
    clase: "estado-ruido",
    icono: "bi-exclamation-triangle-fill",
  },
  3: {
    nombre: "Alarma",
    descripcion: "El nivel acústico supera el límite establecido.",
    clase: "estado-alarma",
    icono: "bi-exclamation-octagon-fill",
  },
};

function formatearNumero(valor, decimales = 1) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "--";
  }

  return numero.toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

function obtenerElemento(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error(`No se encuentra el elemento #${id}`);
  }

  return elemento;
}

export function actualizarDashboard(datos) {
  obtenerElemento("temperatura").textContent = formatearNumero(
    datos.temperatura,
    1,
  );

  obtenerElemento("humedad").textContent = formatearNumero(datos.humedad, 1);

  obtenerElemento("presion").textContent = formatearNumero(datos.presion, 0);

  obtenerElemento("ruido").textContent = formatearNumero(datos.ruido, 1);

  obtenerElemento("ultima-actualizacion").textContent =
    `${datos.fecha ?? "----/--/--"} ${datos.hora ?? "--:--:--"}`;

  actualizarEstado(datos.estado);
  actualizarConexion(true);
}

export function mostrarErrorDashboard(error) {
  console.error("Error del dashboard:", error);

  actualizarConexion(false);

  obtenerElemento("ultima-actualizacion").textContent =
    "No se han podido obtener los datos";
}

function actualizarEstado(codigoEstado) {
  const configuracion = estadosAula[codigoEstado] ?? estadosAula[0];

  const tarjeta = obtenerElemento("tarjeta-estado");
  const icono = obtenerElemento("icono-estado");
  const texto = obtenerElemento("estado-aula");
  const descripcion = obtenerElemento("descripcion-estado");

  tarjeta.classList.remove(
    "estado-silencio",
    "estado-normal",
    "estado-ruido",
    "estado-alarma",
  );

  tarjeta.classList.add(configuracion.clase);

  icono.className = `bi ${configuracion.icono}`;

  texto.textContent = configuracion.nombre;
  descripcion.textContent = configuracion.descripcion;
}

function actualizarConexion(conectado) {
  const indicador = obtenerElemento("estado-conexion");
  const texto = obtenerElemento("texto-conexion");

  indicador.classList.toggle("estado-conexion-online", conectado);

  indicador.classList.toggle("estado-conexion-offline", !conectado);

  texto.textContent = conectado ? "En línea" : "Sin conexión";
}
