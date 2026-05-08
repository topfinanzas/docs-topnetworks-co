# Stack Tecnológico

TopNetworks opera con un stack tecnológico moderno, enfocado en inteligencia artificial (AI-first), diseñado para rendimiento, iteración rápida y tráfico de arbitraje de alto volumen.

## Frameworks Frontend
- **Next.js 15.x–16.x (App Router):** El framework principal para todas las propiedades primarias orientadas al consumidor (`us`, `uk`, `mx`, `budgetbee`, `kardtrust`) y dashboards internos.
- **Astro 5.x:** Se utiliza para sitios estáticos de alto rendimiento donde la hidratación de React no es estrictamente necesaria (`mejoresfinanzas`, sitio corporativo).
- **React 19.x:** Impulsa componentes interactivos, herramientas internas y el Arbitrage Manager Dashboard.

## Lenguajes y Estilos
- **TypeScript (Strict Mode):** Obligatorio en todas las aplicaciones Next.js, Node.js y React.
- **Python:** Impulsa el backend FastAPI para el Arbitrage Manager Dashboard y pipelines de datos.
- **Tailwind CSS v3.4/v4.x:** Framework CSS basado en utilidades para un desarrollo ágil de UI.
- **shadcn/ui & Radix UI:** Componentes accesibles, personalizables y sin estilos predeterminados utilizados para construir el sistema de diseño.

## Inteligencia Artificial y Machine Learning
- **Google Vertex AI (Gemini 2.5 Flash):** LLM principal para la generación automatizada de contenido, generación de correos electrónicos (`EmailGenius`) y textos para redes sociales (`SocialMediaGenius`).
- **Google Generative AI SDK & MCP SDK:** Para el acceso programático al modelo y automatización de despliegues.

## Bases de Datos y Almacenamiento
- **PostgreSQL (driver pg):** Datos transaccionales, autenticación, historial de envíos de correo (Cloud SQL).
- **Google BigQuery:** Data warehouse para analíticas, clasificaciones de IVT (Tráfico Inválido) y rendimiento de campañas.
- **Supabase:** PostgreSQL gestionado y autenticación utilizado en `RouteGenius` y otras herramientas internas.

## Autenticación y Seguridad
- **NextAuth v5 / Better Auth:** Capas de autenticación principales para las aplicaciones Next.js.
- **Firebase Auth / Google OAuth:** Autenticación secundaria para herramientas operativas internas.

## Ad-Tech y Monetización
- **AdZep:** Red de display programática; autoactivada a través de `AdZepNavigationHandler`.
- **TopAds:** Red de anuncios patentada que sirve muros de ofertas personalizados impulsados por GPT.
- **System1:** Integración de arbitraje de búsqueda para monetización contextual.
- **Google Publisher Tags:** Integración de anuncios de display.

## Infraestructura en la Nube (GCP)
Todas las cargas de trabajo de producción se ejecutan en Google Cloud Platform (`us-central1`).
- **Compute Engine:** Aloja el servidor de producción PM2 + proxy inverso Apache.
- **Cloud Run:** Contenedores sin servidor para los backends de FastAPI.
- **Cloud Storage:** CDN de medios (`media-topfinanzas-com`).
- **Cloud Armor:** Protección DDoS y mitigación de bots.
- **Pub/Sub & Cloud Functions:** Pipelines en tiempo real (por ejemplo, clasificación IVT).
- **Cloud DNS:** Gestión de dominios.

## DevOps y Herramientas
- **PM2:** Gestión de procesos Node.js en máquinas virtuales (VMs).
- **Docker / Docker Compose:** Contenerización para TopAds y desarrollo local.
- **Git:** Modelo de ramas de funcionalidades (`dev` → `main` → ramas de respaldo).
- **Google Tag Manager & Google Analytics 4:** Analíticas, seguimiento y atribución.
