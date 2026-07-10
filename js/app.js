"use strict";

import { escucharDatosActuales, obtenerHistoricoFecha } from "./firebase.js";

import { actualizarDashboard, mostrarErrorDashboard } from "./dashboard.js";

import { mostrarGraficaRuido } from "./charts.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.info("Aula Secundaria Dashboard v0.4.0 iniciado");

  try {
    await escucharDatosActuales(actualizarDashboard, mostrarErrorDashboard);

    await cargarGraficaDelDia();
  } catch (error) {
    mostrarErrorDashboard(error);

    console.error("No se pudo cargar el histórico:", error);
  }
});

async function cargarGraficaDelDia() {
  const fechaActual = obtenerFechaActual();

  const registros = await obtenerHistoricoFecha(fechaActual);

  mostrarGraficaRuido(registros, fechaActual);
}

function obtenerFechaActual() {
  const ahora = new Date();

  const ano = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");

  const dia = String(ahora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
