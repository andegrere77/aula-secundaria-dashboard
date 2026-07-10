"use strict";

let graficaRuido = null;

function obtenerElemento(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error(`No se encuentra el elemento #${id}`);
  }

  return elemento;
}

export function mostrarGraficaRuido(registros, fecha) {
  const canvas = obtenerElemento("grafica-ruido");
  const mensaje = obtenerElemento("mensaje-grafica");
  const fechaGrafica = obtenerElemento("fecha-grafica");

  fechaGrafica.textContent = formatearFecha(fecha);

  if (!Array.isArray(registros) || registros.length === 0) {
    mensaje.textContent = "No hay datos históricos para esta fecha.";

    if (graficaRuido) {
      graficaRuido.destroy();
      graficaRuido = null;
    }

    return;
  }

  const registrosOrdenados = [...registros].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  );

  const etiquetas = registrosOrdenados.map(
    (registro) => registro.hora ?? "--:--",
  );

  const valoresRuido = registrosOrdenados.map((registro) =>
    Number(registro.ruido),
  );

  if (graficaRuido) {
    graficaRuido.destroy();
  }

  graficaRuido = new Chart(canvas, {
    type: "line",

    data: {
      labels: etiquetas,

      datasets: [
        {
          label: "Ruido (dBA)",
          data: valoresRuido,
          borderWidth: 2,
          pointRadius: registros.length > 60 ? 0 : 2,
          pointHoverRadius: 5,
          tension: 0.25,
          fill: false,
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
              return `${contexto.parsed.y.toLocaleString("es-ES", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })} dBA`;
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
            text: "Nivel de ruido (dBA)",
          },

          suggestedMin: 30,
          suggestedMax: 80,
        },
      },
    },
  });

  mensaje.textContent = `${registrosOrdenados.length} registros mostrados.`;
}

function formatearFecha(fecha) {
  if (!fecha || !fecha.includes("-")) {
    return "--/--/----";
  }

  const [ano, mes, dia] = fecha.split("-");

  return `${dia}/${mes}/${ano}`;
}
