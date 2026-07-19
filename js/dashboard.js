"use strict";

let timestampUltimaActualizacion = null;
let temporizadorConexion = null;

const LIMITE_DESCONEXION_SEGUNDOS = 75;
const INTERVALO_COMPROBACION_MS = 5000;

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

function obtenerElemento(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error(`No se encuentra el elemento #${id}`);
  }

  return elemento;
}

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

export function iniciarSupervisionConexion() {
  actualizarEstadoConexion();

  if (temporizadorConexion !== null) {
    clearInterval(temporizadorConexion);
  }

  temporizadorConexion = setInterval(
    actualizarEstadoConexion,
    INTERVALO_COMPROBACION_MS,
  );
}

export function actualizarDashboard(datos) {
  obtenerElemento("temperatura").textContent = formatearNumero(
    datos.temperatura,
    1,
  );

  obtenerElemento("humedad").textContent = formatearNumero(datos.humedad, 1);

  obtenerElemento("ruido").textContent = formatearNumero(datos.ruido, 1);

  obtenerElemento("version-firmware").textContent =
    datos.versionFirmware ?? "--";

  const timestampRecibido = Number(datos.timestamp);

  if (Number.isFinite(timestampRecibido) && timestampRecibido > 0) {
    timestampUltimaActualizacion = timestampRecibido;
  }

  actualizarFechaMostrada(datos);
  actualizarEstado(datos.estado);
  actualizarEstadoConexion();
}

export function mostrarErrorDashboard(error) {
  console.error("Error del dashboard:", error);

  cambiarIndicadorConexion(false);

  obtenerElemento("ultima-actualizacion").textContent =
    "No se han podido obtener los datos";
}

function actualizarFechaMostrada(datos) {
  const textoFecha =
    `${datos.fecha ?? "----/--/--"} ` + `${datos.hora ?? "--:--:--"}`;

  const tiempoRelativo = obtenerTiempoRelativo();

  obtenerElemento("ultima-actualizacion").textContent = tiempoRelativo
    ? `${textoFecha} · ${tiempoRelativo}`
    : textoFecha;
}

function actualizarEstadoConexion() {
  if (timestampUltimaActualizacion === null) {
    cambiarIndicadorConexion(false);
    return;
  }

  const ahora = Math.floor(Date.now() / 1000);

  const segundosTranscurridos = Math.max(
    0,
    ahora - timestampUltimaActualizacion,
  );

  const conectado = segundosTranscurridos <= LIMITE_DESCONEXION_SEGUNDOS;

  cambiarIndicadorConexion(conectado);
  actualizarTextoTiempoRelativo();
}

function actualizarTextoTiempoRelativo() {
  const elemento = obtenerElemento("ultima-actualizacion");

  const textoSinTiempo = elemento.textContent.split(" · ")[0];

  const tiempoRelativo = obtenerTiempoRelativo();

  elemento.textContent = tiempoRelativo
    ? `${textoSinTiempo} · ${tiempoRelativo}`
    : textoSinTiempo;
}

function obtenerTiempoRelativo() {
  if (timestampUltimaActualizacion === null) {
    return "";
  }

  const ahora = Math.floor(Date.now() / 1000);

  const segundos = Math.max(0, ahora - timestampUltimaActualizacion);

  if (segundos < 10) {
    return "actualizado ahora";
  }

  if (segundos < 60) {
    return `hace ${segundos} segundos`;
  }

  const minutos = Math.floor(segundos / 60);

  if (minutos === 1) {
    return "hace 1 minuto";
  }

  if (minutos < 60) {
    return `hace ${minutos} minutos`;
  }

  const horas = Math.floor(minutos / 60);

  if (horas === 1) {
    return "hace 1 hora";
  }

  return `hace ${horas} horas`;
}

function cambiarIndicadorConexion(conectado) {
  const indicador = obtenerElemento("estado-conexion");
  const textoConexion = obtenerElemento("texto-conexion");

  indicador.classList.remove(
    "estado-conexion-online",
    "estado-conexion-warning",
    "estado-conexion-offline",
  );

  indicador.classList.add(
    conectado ? "estado-conexion-online" : "estado-conexion-offline",
  );

  textoConexion.textContent = conectado ? "Conectado" : "Sin conexión";
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
