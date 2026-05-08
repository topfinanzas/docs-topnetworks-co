# Procesos y Flujos de Trabajo

## Ciclo de Vida del Desarrollo Local

1. **Ramificación (Branching):** `dev` es la rama de desarrollo local para cada propiedad sincronizada. Todo el trabajo de nuevas características debe completarse en la rama `dev`.
2. **Orquestación de Sincronización:** La habilidad (skill) `topnetworks-sync-orchestrator` gestiona la paridad de múltiples repositorios (SEO/GEO, componentes compartidos) en las cuatro propiedades principales sin comprometer la localización específica del mercado.
3. **Preparación de Despliegue:** El estado aprobado de la funcionalidad se fusiona/sincroniza localmente con `main` y se sube al origen (push a origin). El árbol de trabajo local siempre debe volver a la rama `dev` después de la sincronización.

## Flujo de Trabajo de Despliegue

1. **Pre-vuelo Local (Local Preflight):** Ejecutar `scripts/topnetworks-deploy.mjs preflight --execute` para auditar los scripts de git/despliegue y ejecutar la validación.
2. **Flujo de Trabajo Git:** Ejecutar `bash ./scripts/git-workflow.sh "$(cat lib/documents/commit-message.txt)"` localmente para enviar los cambios a la rama `main`.
3. **Actualización Remota:** El script de despliegue en el lado del servidor (`scripts/deploy_update.sh`) opera estrictamente en el servidor remoto (`34.45.27.247`), descargando los últimos cambios de `main` desde el origen, construyendo la aplicación y reiniciando PM2.
   - Los directorios remotos se mapean a los proyectos locales:
     - `topfinanzas-us-next` -> `/var/www/html/topfinanzas-us-next`
     - `uk-topfinanzas-com` -> `/var/www/html/uk`
     - `topfinanzas-mx-next` -> `/var/www/html/topfinanzas-mx-next`
     - `budgetbee-next` -> `/var/www/html/budgetbee-next`

## Gestión de Campañas de Arbitraje

1. **Lanzamiento de Campaña:** Las campañas de tráfico pago se lanzan dirigidas a verticales específicas (ej. tarjetas de crédito) con límites estrictos de CPA.
2. **Monitoreo de Spread:** El Arbitrage Manager Dashboard evalúa constantemente el Spread (`Ingresos por Sesión - Costo por Sesión`) cada hora.
3. **Acciones de Optimización:** Si los spreads se comprimen, el enrutamiento del tráfico se ajusta dinámicamente o las campañas se pausan automáticamente para evitar un ROI negativo.

## Generación de Contenido y Correo Electrónico

1. **Resúmenes de Contenido (Briefs):** Definidos utilizando el manual de jugadas (playbook) de TopNetworks.
2. **Generación:** Vertex AI genera el primer borrador a través de `EmailGenius` o `SocialMediaGenius`.
3. **Revisión y Despacho:** El contenido es revisado, aprobado y despachado (por ejemplo, a través de ActiveCampaign o ConvertKit).
