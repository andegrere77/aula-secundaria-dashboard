"use strict";

import { escucharDatosActuales } from "./firebase.js";

import { actualizarDashboard, mostrarErrorDashboard } from "./dashboard.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.info("Aula Secundaria Dashboard v0.3.0 iniciado");

  try {
    await escucharDatosActuales(actualizarDashboard, mostrarErrorDashboard);
  } catch (error) {
    mostrarErrorDashboard(error);
  }
});
