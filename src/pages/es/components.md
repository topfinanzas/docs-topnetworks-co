# Componentes y Sistema UI

TopNetworks mantiene un sistema de interfaz de usuario centralizado construido sobre **Tailwind CSS**, **Radix UI** y **shadcn/ui** para garantizar una experiencia de usuario visualmente consistente, accesible y de alto rendimiento en todas las propiedades.

## Sistema de Diseño Central

La identidad de TopNetworks se construye en torno a una estética vibrante y orientada a la tecnología.

### Paleta de la Marca

- **Azul de la Marca:** `#2563eb` (`blue-600`) - Color principal de la marca, CTAs principales.
- **Cian de la Marca:** `#0891b2` (`cyan-600`) - Color secundario de la marca, acentos.
- **Lima/Verde de la Marca:** `#84cc16` (`lime-500` / `green-600`) - Color de acento, indicadores de éxito, reflejos vibrantes.

### Tipografía

- **Fuente Principal:** Poppins (Google Fonts). Utilizada para todo el texto de la interfaz, encabezados y cuerpo de texto.
  - Pesos: 300 (Ligera), 400 (Regular), 500 (Media), 600 (Semi-Negrita), 700 (Negrita).

### Degradados

El degradado tricolor de la marca es un elemento distintivo:

```css
.brand-gradient-text {
  @apply bg-gradient-to-r from-blue-600 via-cyan-600 to-lime-600 bg-clip-text text-transparent;
}
```

## Arquitectura de UI Compartida

### shadcn/ui & Radix UI

Utilizamos `shadcn/ui` para nuestra capa de componentes base. Esto proporciona primitivas sin estilos predeterminados y completamente accesibles (vía Radix UI) que estilizamos con Tailwind CSS.

- Ejemplos: Acordeones, Diálogos, Menús Desplegables, Casillas de Verificación y controles de Formulario.
- Ubicación: `components/ui/`

### Formularios y Validación

- **React Hook Form:** Para la gestión del estado de los formularios.
- **Zod:** Para la validación basada en esquemas.
- **Integración:** Combinados a través de `@hookform/resolvers/zod` para garantizar formularios seguros y accesibles para la captura de clientes potenciales y cuestionarios.

### Iconos

- **Lucide React:** La biblioteca de iconos oficial en todas las aplicaciones de TopNetworks.

## Patrones de Componentes

### Botones

Los botones utilizan variantes estándar (primario, secundario, destructivo, fantasma). Las acciones primarias a menudo aprovechan el degradado de la marca:

```tsx
<button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200">
  Aplicar Ahora
</button>
```

### Diseños (Layouts)

- **Mobile-First:** Todos los diseños están orientados primero a dispositivos móviles (mobile-first).
- **Contenedores:** El contenido se restringe utilizando la clase `container` de Tailwind o contenedores personalizados con un ancho máximo (max-width wrappers).
- **Espaciado:** Basado en un sistema de cuadrícula estandarizado de 4px/8px (`gap-4`, `p-6`, etc.).

### Modo Oscuro

El modo oscuro es compatible a través del modificador `dark:` de Tailwind. Los colores cambian dinámicamente a variantes oscuras optimizadas (por ejemplo, fondos azul oscuro con primeros planos casi blancos).
