# Technology Stack

TopNetworks operates with a modern, AI-first technology stack designed for performance, rapid iteration, and high-volume arbitrage traffic.

## Frontend Frameworks
- **Next.js 15.x–16.x (App Router):** The core framework for all primary consumer properties (`us`, `uk`, `mx`, `budgetbee`, `kardtrust`) and internal dashboards.
- **Astro 5.x:** Used for high-performance static sites where React hydration isn't strictly necessary (`mejoresfinanzas`, corporate site).
- **React 19.x:** Powers interactive components, internal tools, and the Arbitrage Manager Dashboard.

## Languages & Styling
- **TypeScript (Strict Mode):** Mandatory across all Next.js, Node.js, and React applications.
- **Python:** Powers the FastAPI backend for the Arbitrage Manager Dashboard and data pipelines.
- **Tailwind CSS v3.4/v4.x:** Utility-first CSS framework for rapid UI development.
- **shadcn/ui & Radix UI:** Accessible, customizable, and unstyled components used to build the design system.

## AI & Machine Learning
- **Google Vertex AI (Gemini 2.5 Flash):** Primary LLM for automated content generation, email broadcast generation (`EmailGenius`), and social media copy (`SocialMediaGenius`).
- **Google Generative AI SDK & MCP SDK:** For programmatic model access and deployment automation.

## Databases & Storage
- **PostgreSQL (pg driver):** Transactional data, authentication, email broadcast history (Cloud SQL).
- **Google BigQuery:** Data warehouse for analytics, IVT (Invalid Traffic) classifications, and campaign performance.
- **Supabase:** Managed PostgreSQL and authentication used in `RouteGenius` and other internal tools.

## Authentication & Security
- **NextAuth v5 / Better Auth:** Primary authentication layers for Next.js applications.
- **Firebase Auth / Google OAuth:** Secondary auth for internal operational tools.

## Ad-Tech & Monetization
- **TopAds:** Proprietary ad network serving custom GPT-powered offer walls.
- **System1:** Search arbitrage integration for contextual monetization.
- **Google Publisher Tags:** Display ad integration.

## Cloud Infrastructure (GCP)
All production workloads run on Google Cloud Platform (`us-central1`).
- **Compute Engine:** Hosts production PM2 + Apache reverse proxy.
- **Cloud Run:** Serverless containers for FastAPI backends.
- **Cloud Storage:** Media CDN (`media-topfinanzas-com`).
- **Cloud Armor:** DDoS protection and bot mitigation.
- **Pub/Sub & Cloud Functions:** Real-time pipelines (e.g., IVT classification).
- **Cloud DNS:** Domain management.

## DevOps & Tools
- **PM2:** Node.js process management on VMs.
- **Docker / Docker Compose:** Containerization for TopAds and local development.
- **Git:** Feature branching model (`dev` → `main` → backup branching).
- **Google Tag Manager & Google Analytics 4:** Analytics, tracking, and attribution.
