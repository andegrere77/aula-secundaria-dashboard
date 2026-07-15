"use strict";

import {
  escucharDatosActuales,
  obtenerHistoricoFecha,
} from "./firebase.js?v=0.8.1";

import {
  actualizarDashboard,
  mostrarErrorDashboard,
  iniciarSupervisionConexion,
} from "./dashboard.js?v=0.8.1";

import { mostrarGraficaHistorico } from "./charts.js?v=0.8.1";

document.addEventListener("DOMContentLoaded", async () => {
  console.info("Aula Secundaria Dashboard v0.8.0 iniciado");

  configurarControlesHistorico();
  iniciarSupervisionConexion();

  try {
    await escucharDatosActuales(actualizarDashboard, mostrarErrorDashboard);

    await cargarHistoricoSeleccionado();
  } catch (error) {
    mostrarErrorDashboard(error);

    console.error("No se pudo iniciar el dashboard:", error);
  }
});

function configurarControlesHistorico() {
  const selectorFecha = document.getElementById("selector-fecha");

  const selectorVariable = document.getElementById("selector-variable");

  selectorFecha.value = obtenerFechaActual();

  selectorFecha.addEventListener("change", cargarHistoricoSeleccionado);

  selectorVariable.addEventListener("change", cargarHistoricoSeleccionado);
}

async function cargarHistoricoSeleccionado() {
  const selectorFecha = document.getElementById("selector-fecha");

  const selectorVariable = document.getElementById("selector-variable");

  const mensaje = document.getElementById("mensaje-grafica");

  const fecha = selectorFecha.value;
  const variable = selectorVariable.value;

  if (!fecha) {
    mensaje.textContent = "Selecciona una fecha válida.";
    return;
  }

  mensaje.textContent = "Cargando histórico...";

  try {
    const registros = await obtenerHistoricoFecha(fecha);

    mostrarGraficaHistorico(registros, fecha, variable);
  } catch (error) {
    console.error("Error cargando el histórico:", error);

    mensaje.textContent = "No se ha podido cargar el histórico.";
  }
}

function obtenerFechaActual() {
  const ahora = new Date();

  const ano = ahora.getFullYear();

  const mes = String(ahora.getMonth() + 1).padStart(2, "0");

  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
