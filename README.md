# Frontend — Evaluación técnica (Clientes)

Este repositorio contiene la aplicación frontend (React) que consume un backend separado para gestionar "Clientes". El backend es externo y no forma parte de este repositorio; aquí solo está la interfaz de usuario.

Resumen de lo implementado
- Listado de clientes con paginación y estados claros (cargando, vacío, error).
- Crear cliente: formulario con validación en cliente y manejo de errores del servidor.
- Editar cliente: formulario con validación en vivo (comprobación de email existente).
- Eliminar cliente: botón con modal de confirmación accesible, spinner por fila y feedback (toast).
- Búsqueda con debounce y sincronización de parámetros en la URL (search, page, per_page).
- Responsive: sidebar con drawer para móvil (hamburger), y lista se convierte a tarjetas en anchos pequeños para mejor legibilidad.
- Theming: soporte de modo claro/oscuro con variables CSS y un toggle (FAB).

Cómo ejecutar
1. Abrir una terminal en la carpeta del frontend:
```powershell
cd "C:\Users\mario\Documents\Nueva carpeta (4)\Evaluacion-tecnica-Front-JOAO"
npm install
npm start
```
2. Abrir http://localhost:3000 en el navegador.

Notas importantes
- El backend es independiente. Asegúrate de que la API de Clientes (endpoints esperados) esté disponible y configurada en el cliente (revisa `src/services/clienteService.js` para la URL/base).
- El frontend asume que el endpoint de lista devuelve, cuando `paginate=true`, un objeto con `data` y `pagination` que incluye `current_page`, `last_page`, `per_page`, `total`.
- Validaciones del formulario esperan respuestas tipo Laravel (`errors` con arrays) o `message` para errores globales; existe `src/utils/errorUtils.js` que normaliza distintos formatos.

Archivos y componentes clave (resumen rápido)
- `src/pages/ClienteList.js` — listado, búsqueda, paginación, eliminación.
- `src/pages/ClienteCreate.js` — formulario de creación (validaciones y toasts).
- `src/pages/ClienteEdit.js` — formulario de edición con validación en vivo.
- `src/components/ConfirmModal.js` — modal accesible para confirmaciones.
- `src/components/Spinner.js` — spinner reutilizable.
- `src/components/Toast.js` — provider y UI para toasts.
- `src/services/clienteService.js` — llamadas HTTP a la API de Clientes (axios).
- `src/utils/errorUtils.js` — normalización de errores del backend.
- `src/styles/*.css` — archivos de estilos por componente (sidebar, lista, formularios, modal, spinner).

Decisiones y supuestos
- El diseño usa CSS variables y archivos CSS por componente para mantener la simplicidad y facilitar el theming.
- El drawer de la sidebar implementa bloqueo de scroll y cierre con Escape; hay lógica básica de foco, y puede mejorarse con un focus-trap más estricto si se desea.
- La verificación de email en vivo llama a un endpoint `checkEmail` y muestra estado de comprobación (spinner) y error si el email existe.

Pruebas recomendadas (smoke tests)
- Crear un cliente válido y verificar que aparece en la lista.
- Intentar crear con email duplicado y verificar validación en vivo y mensajes del servidor.
- Eliminar un cliente y confirmar que modal, spinner y toast funcionan.
- Comprobar comportamiento responsive: abrir app en ancho <=768px y verificar el toggle de la sidebar; en <=480px la lista debe verse en tarjetas.

Posibles mejoras (opcionales)
- Mover el botón de apertura del drawer al header para evitar superposición visual con el título.
- Añadir focus-trap completo para el drawer (mejora de accesibilidad).
- Añadir tests unitarios/integ. con React Testing Library para flujos críticos.
- Pulir animaciones y microinteracciones.

---
PEQUEÑA NOTA: este README documenta lo hecho en el frontend solamente; el backend es un proyecto separado y no está incluido aquí.

## Nota para el evaluador

Este documento está redactado para facilitar la evaluación: explica de forma clara qué se implementó, cómo probarlo localmente y cómo cada requisito del enunciado fue atendido. Abajo se detalla el cumplimiento punto por punto, las decisiones de diseño y las limitaciones conocidas.

## Cumplimiento de requisitos (mapa directo)

- Requisitos mínimos
	- Mostrar un listado de clientes — Hecho: `src/pages/ClienteList.js` muestra listado con paginación y estados (cargando, vacío, error).
	- Opción visual para crear cliente — Hecho: `src/pages/ClienteCreate.js` (formulario con validaciones básicas y manejo de errores del servidor).
	- Opción visual para eliminar cliente — Hecho: botón "Eliminar" con modal de confirmación accesible (`src/components/ConfirmModal.js`) y spinner por fila durante la eliminación.
	- Estados claros (lista vacía, cargando, error) — Hecho: vistas dedicadas para cada estado y mensajes amigables.
	- Diseño responsivo, limpio y legible — Hecho: CSS por componente, variables para theming, lista cambia a tarjetas en móviles y sidebar se transforma en drawer.

- Requisitos opcionales (implementados y valorados)
	- Edición de cliente con validación en vivo — Implementado: `src/pages/ClienteEdit.js` con comprobación de email en tiempo real.
	- Validaciones visuales claras en formulario — Implementado: errores por campo, banner global para errores no mapeables, y comprobación de email existente con indicador.
	- Búsqueda/filtrado en la lista — Implementado: búsqueda con debounce (500ms) y sincronización de la URL (`useSearchParams`).
	- Feedback visual (toasts, modales, loaders) — Implementado: provider de toasts, modal de confirmación accesible, Spinner reutilizable.
	- Paginación — Implementado: paginación numerada con truncado, select "Por página" y reconciliación con la respuesta del servidor.

## Detalles de diseño y UX destacados

- Accesibilidad: los modales usan manejo de foco y cierran con Escape; botones tienen estados deshabilitados claros y aria-labels donde aplica. El drawer bloquea el scroll de fondo cuando está abierto.
- Responsive: en pantallas <=480px la tabla se transforma en filas tipo tarjeta (cada campo se muestra con su etiqueta) para legibilidad; sidebar se oculta y se abre con un botón hamburguesa.
- Robustez: la app normaliza distintos formatos de errores del backend (`src/utils/errorUtils.js`) para mostrar mensajes útiles al usuario.
- Interacciones: búsqueda debounced para evitar ráfagas de peticiones, per-row spinner para eliminación (mejor UX), y reconciliación de página cuando el backend devuelve un `current_page` distinto.

## Cómo ejecutar (resumen rápido)

1. Abrir terminal en la carpeta del frontend:

```powershell
cd "C:\Users\mario\Documents\Nueva carpeta (4)\Evaluacion-tecnica-Front-JOAO"
npm install
npm start
```

2. Abrir http://localhost:3000 en el navegador.

Nota: el frontend espera que exista el backend de Clientes; revise y ajuste la URL/base en `src/services/clienteService.js` si el API está en otra dirección.

## Archivos clave y qué contienen

- `src/pages/ClienteList.js` — listado, búsqueda, paginación, eliminación.
- `src/pages/ClienteCreate.js` — formulario de creación con validaciones.
- `src/pages/ClienteEdit.js` — formulario de edición con validación en vivo.
- `src/components/ConfirmModal.js` — modal accesible para confirmar acciones.
- `src/components/Toast.js` — provider para toasts y notificaciones.
- `src/components/Spinner.js` — componente spinner reutilizable.
- `src/services/clienteService.js` — cliente HTTP (axios) con funciones para listar, crear, editar, eliminar y checkEmail.
- `src/utils/errorUtils.js` — normalizador de errores del backend.
- `src/styles/*.css` — estilos por componente y theming.

## Supuestos y contractos con el backend

- El endpoint de listado de clientes, cuando se solicita paginación, retorna JSON con `data` y `pagination` ({ current_page, last_page, per_page, total, from, to }).
- El endpoint de comprobación de email devuelve `{ exists: boolean }` o un formato simple que `clienteService.checkEmail` interpreta.
- Los errores de validación vienen en formato Laravel (`errors: { field: [msg] }`) o mensajes globales en `message`.


---

**Desarrollado por**: Mario Pazmiño  