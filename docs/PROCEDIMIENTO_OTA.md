# Procedimiento de actualización OTA

El sistema permite actualizar remotamente el firmware del ESP32 mediante
Firebase Hosting y una conexión HTTPS.

## Componentes

- `version.txt`: indica la última versión disponible.
- `firmware.bin`: contiene el firmware que instalará el ESP32.
- Firebase Hosting: publica ambos archivos.
- Realtime Database: almacena información descriptiva de la versión OTA.
- ESP32: consulta la versión, descarga el binario y reinicia con la nueva versión.

## Ubicación de los archivos

En el proyecto del dashboard:

```text
firmware/
├── version.txt
└── firmware.bin
```
