"use strict";

let graficaHistorico = null;

const configuracionVariables = {
  ruido: {
    titulo: "Evolución del ruido",
    etiqueta: "Ruido",
    unidad: "dBA",
    decimales: 1,
    minimoSugerido: 30,
    maximoSugerido: 80,
  },

  temperatura: {
    titulo: "Evolución de la temperatura",
    etiqueta: "Temperatura",
    unidad: "°C",
    decimales: 1,
    minimoSugerido: 10,
    maximoSugerido: 40,
  },

  humedad: {
    titulo: "Evolución de la humedad",
    etiqueta: "Humedad",
    unidad: "%",
    decimales: 1,
    minimoSugerido: 0,
    maximoSugerido: 100,
  },
};

function obtenerElemento(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error(`No se encuentra el elemento #${id}`);
  }

  return elemento;
}

export function mostrarGraficaHistorico(registros, fecha, variable) {
  const configuracion =
    configuracionVariables[variable] ?? configuracionVariables.temperatura;

  const canvas = obtenerElemento("grafica-historico");
  const mensaje = obtenerElemento("mensaje-grafica");
  const titulo = obtenerElemento("titulo-grafica");

  titulo.textContent = configuracion.titulo;

  if (!Array.isArray(registros) || registros.length === 0) {
    mensaje.textContent = "No existen registros para la fecha seleccionada.";

    destruirGrafica();
    return;
  }

  const registrosOrdenados = [...registros].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  );

  const etiquetas = registrosOrdenados.map(
    (registro) => registro.hora ?? "--:--:--",
  );

  const valores = registrosOrdenados.map((registro) => {
    const valor = Number(registro[variable]);

    return Number.isFinite(valor) ? valor : null;
  });

  destruirGrafica();

  graficaHistorico = new Chart(canvas, {
    type: "line",

    data: {
      labels: etiquetas,

      datasets: [
        {
          label: `${configuracion.etiqueta} ` + `(${configuracion.unidad})`,

          data: valores,
          borderWidth: 2,
          pointRadius: registrosOrdenados.length > 60 ? 0 : 2,
          pointHoverRadius: 5,
          tension: 0.25,
          fill: false,
          spanGaps: true,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label(contexto) {
              const valor = contexto.parsed.y;

              return (
                `${configuracion.etiqueta}: ` +
                `${formatearNumero(
                  valor,
                  configuracion.decimales,
                )} ${configuracion.unidad}`
              );
            },
          },
        },
      },

      scales: {
        x: {
          title: {
            display: true,
            text: "Hora",
          },

          ticks: {
            maxTicksLimit: 12,
          },
        },

        y: {
          title: {
            display: true,
            text: `${configuracion.etiqueta} ` + `(${configuracion.unidad})`,
          },

          suggestedMin: configuracion.minimoSugerido,

          suggestedMax: configuracion.maximoSugerido,
        },
      },
    },
  });

  mensaje.textContent =
    `${registrosOrdenados.length} registros mostrados ` +
    `para el ${formatearFecha(fecha)}.`;
}

function destruirGrafica() {
  if (graficaHistorico) {
    graficaHistorico.destroy();
    graficaHistorico = null;
  }
}

function formatearNumero(valor, decimales) {
  return Number(valor).toLocaleString("es-ES", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}

function formatearFecha(fecha) {
  if (!fecha || !fecha.includes("-")) {
    return "--/--/----";
  }

  const [ano, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${ano}`;
}
