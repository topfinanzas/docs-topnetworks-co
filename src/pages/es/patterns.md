# Patrones de Código y Estándares

TopNetworks sigue un conjunto unificado de estándares de codificación en todos los proyectos de Next.js, Astro y React para garantizar la mantenibilidad, el rendimiento y la colaboración entre equipos.

## Lenguaje y Sintaxis

- **TypeScript Primero:** Todo el código nuevo debe escribirse en TypeScript con `strict: true`. Evitar el uso de `any`; utilizar tipado estricto y esquemas Zod para la validación.
- **ES Modules:** Utilizar importaciones modernas de ES modules (`import`/`export`).

## Patrones en Next.js (App Router)

- **Componentes de Servidor por Defecto:** Minimizar el uso de JavaScript del lado del cliente utilizando React Server Components. Solo agregar `"use client"` cuando se requiera estado, efectos o interactividad en el DOM.
- **Recuperación de Datos:** Recuperar datos en el servidor siempre que sea posible utilizando `fetch` de Next.js con las estrategias de almacenamiento en caché adecuadas.
- **Enrutamiento:** Organizar las páginas por funcionalidad o tipo de contenido dentro del directorio `app`. Utilizar rutas dinámicas `[slug]` para el contenido MDX.
- **Pipeline de Contenido MDX:** Las guías financieras, los artículos y las reseñas se escriben en MDX para intercalar componentes de React (ej. tablas comparativas, calculadoras) dentro del contenido en Markdown.

## Gestión del Estado

- **Estado en la URL:** Preferir la URL (parámetros de consulta) para el estado de los filtros, búsquedas y selección de pestañas. Esto garantiza la capacidad de compartir el enlace y mejora el SEO.
- **React Context:** Usar React Context con moderación, típicamente para temas globales, estado de autenticación de usuario (NextAuth/Better Auth) o configuraciones de localización.
- **Estado del Servidor:** Utilizar React Query o SWR para recuperaciones complejas de datos en el cliente y almacenamiento en caché, aunque los Server Components manejan la mayoría de las cargas iniciales.

## Rendimiento

- **Optimización de Imágenes:** Todas las imágenes deben utilizar el componente `<Image>` de Next.js o la optimización equivalente de Astro. WebP es el formato obligatorio para todos los activos en producción servidos desde `media-topfinanzas-com`.
- **Core Web Vitals:** Mantener el LCP por debajo de 2.5s y el CLS cerca de cero. Cargar los scripts de anuncios de terceros (ej. System1) de forma asincrónica y aplazar el Javascript no crítico.

## Seguridad

- **Autenticación:** Utilizar NextAuth.js o Better Auth para una gestión segura de las sesiones.
- **Variables de Entorno:** Nunca confirmar secretos en el repositorio (commits). Acceder a configuraciones sensibles exclusivamente en el servidor.

## Organización del Código

```
src/
├── app/               # Next.js App Router (páginas, layouts, rutas de API)
├── components/        # Componentes UI reutilizables
│   ├── ui/            # Componentes base (shadcn/ui, Radix)
│   └── shared/        # Componentes compartidos entre funcionalidades
├── lib/               # Funciones de utilidad, clientes de API, constantes
├── hooks/             # Hooks personalizados de React
└── content/           # Archivos MDX y datos estructurados
```
