# Arquitectura

La arquitectura de TopNetworks está diseñada para soportar el ciclo principal de arbitraje de publicidad digital: adquirir tráfico a través de canales pagos y convertirlo de manera eficiente a través de propiedades de contenido de alto rendimiento.

## El Ciclo de Arbitraje

1. **Adquisición de Tráfico:** El tráfico pago se adquiere a través de Meta Ads, Google Ads o redes programáticas.
2. **Enrutamiento:** `RouteGenius` evalúa el tráfico entrante basándose en datos de spread en tiempo real y lo dirige a la propiedad de contenido óptima utilizando algoritmos probabilísticos.
3. **Interacción:** Los usuarios llegan a propiedades de Next.js o Astro, diseñadas para capturar la intención a través de contenido optimizado para SEO, cuestionarios y herramientas de comparación.
4. **Monetización:** `TopAds`, enlaces de socios CPA y feeds de búsqueda de `System1` convierten la intención capturada en ingresos.
5. **Analíticas y Optimización:** Las métricas (ej. CPC, RPM, EPC, ROAS) se rastrean a través de UTMs (`[country]_tf_[platform]_broad`). El Arbitrage Manager Dashboard evalúa constantemente el Spread (`Ingresos por Sesión - Costo por Sesión`) y ajusta el enrutamiento del tráfico.

## Infraestructura Global

Todo el tráfico pasa a través de **Google Cloud Platform (GCP)**:

- **Global Load Balancer (`35.190.2.62`):** Enruta todos los dominios de la cartera.
- **Cloud Armor (`topnetworks-armor-policy`):** Aplica protección contra DDoS, bloqueo de IPs y mitigación de bots en el nivel superior.
- **Máquina Virtual de Producción (`34.45.27.247`):** Ejecuta Ubuntu 22.04 LTS, con Apache 2.4.52 funcionando como proxy inverso. Las aplicaciones son gestionadas por PM2 en puertos específicos (ej. US en 3040, UK en 3004, MX en 3030).

## Canal de IVT (Tráfico Inválido)

TopNetworks emplea un canal robusto para garantizar la calidad del tráfico:

```text
Cloud Armor 
   ↓
Pub/Sub 
   ↓
Cloud Function (ivt-classifier) 
   ↓
BigQuery 
   ↓
TrafficGenius Dashboard
```

Este canal clasifica y visualiza el tráfico de bots, el fraude de clics y los eventos de impresiones inválidas en tiempo real.

## Sistemas Internos

### RouteGenius
Motor de distribución de tráfico construido en Next.js 16.1, Supabase, Better Auth y Firebase. Utiliza algoritmos de enrutamiento probabilístico.

### Arbitrage Manager Dashboard
Analíticas de campañas en tiempo real que integran la API de Meta Ads y datos de System1. Utiliza un backend FastAPI (Python) en Cloud Run, un frontend React/Vite y BigQuery.

### Generación de Contenido
- **EmailGenius:** Genera emisiones de correo electrónico a través de Vertex AI (Gemini 2.5 Flash), construido sobre Next.js 15.5.
- **Social Media Genius:** Generación de contenido para redes sociales asistido por IA utilizando canvas de Konva y Vertex AI.

### Red TopAds
Red de anuncios patentada que sirve muros de ofertas. Construida con Node.js/Express y Docker/Nginx.
