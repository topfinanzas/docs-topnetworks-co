# Funciones y Utilidades Compartidas

Los repositorios de código de TopNetworks comparten un conjunto de patrones de utilidad comunes para manejar el formato, el seguimiento, el enrutamiento y las interacciones con APIs.

## Seguimiento UTM y Atribución

Un componente crítico del ciclo de arbitraje es garantizar que cada sesión se rastree desde la adquisición hasta la conversión.

- **Estructura UTM:** `[country]_tf_[platform]_broad`
  - Ejemplo: `us_tf_meta_broad`
- **Funciones de Utilidad:** Funciones para analizar, persistir y agregar parámetros UTM a todos los enlaces de salida de CPA.

## Utilidades de Formato

- **Formato de Moneda:** `formatCurrency(amount, currencyCode)` para manejar correctamente USD, GBP y MXN basándose en la configuración regional activa.
- **Formato de Fecha:** Utilidades estandarizadas para el formato de fechas utilizando la función nativa `Intl.DateTimeFormat`.
- **Manipulación de Cadenas:** Utilidades para generar slugs compatibles con URLs y formatear texto para mostrarlo en la interfaz de usuario.

## Integración de Analíticas

- **GTM (Google Tag Manager):** Utilidades estandarizadas para enviar datos a dataLayer (dataLayer push) para realizar un seguimiento de las vistas de página, envíos de leads y clics salientes.
- **Google Analytics 4:** Wrappers (envoltorios) para el seguimiento de eventos.

## Utilidades en la Nube y API

- **Google Cloud Storage:** Utilidades para generar URLs firmadas o leer activos directamente desde el bucket `media-topfinanzas-com`.
- **Registro de BigQuery (Logging):** Funciones para registrar asincrónicamente señales de IVT (Tráfico Inválido) y métricas de sesión.

## Wrappers de Generación con IA

Para herramientas internas como `EmailGenius` y `SocialMediaGenius`, encapsulamos las bibliotecas `@google/genai` y `@modelcontextprotocol/sdk`:

- **Constructores de Prompt Engineering:** Utilidades para ensamblar el contexto, las reglas y las variables de entrada en prompts estructurados para Gemini 2.5 Flash.
- **Analizadores de Respuesta (Parsers):** Funciones para validar y analizar la salida JSON estructurada de los LLMs utilizando Zod.
