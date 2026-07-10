"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getAuth,
  signInAnonymously,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3zw7vevcPSEVLoZzr_I4ndLfJPCPYITc",
  authDomain: "aula-secundaria.firebaseapp.com",
  databaseURL:
    "https://aula-secundaria-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "aula-secundaria",
  storageBucket: "aula-secundaria.firebasestorage.app",
  messagingSenderId: "399228079082",
  appId: "1:399228079082:web:2808ecbbea34ee7be54093",
};

const aplicacionFirebase = initializeApp(firebaseConfig);
const autenticacion = getAuth(aplicacionFirebase);
const baseDatos = getDatabase(aplicacionFirebase);

const RUTA_DATOS_ACTUALES = "aulas/AULA-001/actual";

/**
 * Autentica anónimamente el navegador y comienza a escuchar
 * los cambios realizados por el ESP32.
 */
export async function escucharDatosActuales(alRecibirDatos, alProducirseError) {
  await signInAnonymously(autenticacion);

  const referenciaDatos = ref(baseDatos, RUTA_DATOS_ACTUALES);

  return onValue(
    referenciaDatos,
    (snapshot) => {
      if (!snapshot.exists()) {
        alProducirseError(new Error("No existen datos actuales del aula"));
        return;
      }

      alRecibirDatos(snapshot.val());
    },
    alProducirseError,
  );
}
