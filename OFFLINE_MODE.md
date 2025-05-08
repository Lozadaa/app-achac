# Modo Offline en la Aplicación ACHAC

Este documento explica cómo funciona el modo offline (sin conexión) implementado en la aplicación ACHAC, permitiendo a los usuarios seguir trabajando incluso cuando no tienen conexión a Internet.

## Características Principales

- **Funcionamiento sin conexión:** La aplicación detecta automáticamente cuando no hay conexión a Internet y cambia a modo offline.
- **Almacenamiento local:** Los datos necesarios se almacenan localmente en el dispositivo.
- **Sincronización automática:** Al recuperar la conexión, los datos se sincronizan automáticamente con el servidor.
- **Notificaciones:** El usuario recibe notificaciones sobre el estado de la conexión y la sincronización.

## Módulos con Soporte Offline

Actualmente, los siguientes módulos tienen soporte para funcionar sin conexión:

1. **Módulo de Feedback:** Permite ver, crear y eliminar feedbacks sin conexión.
2. **Módulo de Asistencia (Attendants):** Permite registrar y actualizar la asistencia de los estudiantes sin conexión.

## Indicadores Visuales

- **Barra de estado de red:** En el menú lateral se muestra el estado actual de la conexión.
- **Notificación en pantalla:** Cuando la aplicación está en modo offline, se muestra una notificación en la parte superior de la pantalla.
- **Toasts de sistema:** Se muestran notificaciones toast cuando se pierde o recupera la conexión, así como cuando se sincronizan los datos.

## Limitaciones

- **Datos parciales:** Solo se pueden acceder a los datos que se hayan cargado previamente cuando el dispositivo tenía conexión.
- **Operaciones restringidas:** Algunas operaciones complejas pueden no estar disponibles en modo offline.

## Cómo Funciona Técnicamente

1. **Detección de Conectividad:** Utilizamos el plugin `@capacitor/network` para detectar cambios en la conectividad del dispositivo.

2. **Almacenamiento Local:**

   - Para datos de navegación (GET): Se almacenan en caché usando `@capacitor/preferences`.
   - Para operaciones de escritura (POST/PUT/PATCH/DELETE): Se almacenan en una cola de solicitudes pendientes.

3. **Sincronización:**

   - Cuando se recupera la conexión, las solicitudes pendientes se ejecutan en el orden en que fueron creadas.
   - Se sincronizan automáticamente al detectar conexión o manualmente con el botón "Sincronizar".

4. **Manejo de Conflictos:**
   - Las operaciones se procesan en el orden cronológico en que fueron realizadas para minimizar conflictos.
   - Las respuestas de error del servidor se gestionan adecuadamente para operaciones fallidas.

## Uso para Desarrolladores

Para aplicar soporte offline a nuevos componentes:

1. Reemplazar las llamadas a `axiosClient` por `axiosOffline` del módulo `@/utils/axiosOffline`.
2. Utilizar el componente `<OfflineNotification />` para mostrar el estado de conexión.
3. Usar el hook `useNetwork()` para obtener el estado actual de la conexión.
4. Implementar el hook `useOfflineSync()` para manejar la sincronización de datos.

## Pruebas de Modo Offline

Para probar el modo offline:

1. Cargar la aplicación con conexión a Internet.
2. Activar el modo avión o desconectar la red.
3. Realizar operaciones en la aplicación (registrar asistencia, añadir feedback, etc.).
4. Reactivar la conexión y verificar que los datos se sincronizan correctamente.
