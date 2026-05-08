# Architecture

The TopNetworks architecture is designed to support the core digital advertising arbitrage loop: acquiring traffic via paid channels and efficiently converting it through high-performance content properties.

## The Arbitrage Loop

1. **Traffic Acquisition:** Paid traffic is acquired via Meta Ads, Google Ads, or programmatic networks.
2. **Routing:** `RouteGenius` evaluates incoming traffic based on real-time spread data and routes it to the optimal content property using probabilistic algorithms.
3. **Engagement:** Users land on Next.js or Astro properties, designed to capture intent via SEO-optimized content, quizzes, and comparison tools.
4. **Monetization:** `AdZep`, `TopAds`, CPA partner links, and `System1` search feeds convert the captured intent into revenue.
5. **Analytics & Optimization:** Metrics (e.g., CPC, RPM, EPC, ROAS) are tracked via UTMs (`[country]_tf_[platform]_broad`). The Arbitrage Manager Dashboard constantly evaluates the Spread (`Revenue per Session - Cost per Session`) and adjusts traffic routing.

## Global Infrastructure

All traffic passes through **Google Cloud Platform (GCP)**:

- **Global Load Balancer (`35.190.2.62`):** Routes all portfolio domains.
- **Cloud Armor (`topnetworks-armor-policy`):** Enforces DDoS protection, IP blocking, and bot mitigation upstream.
- **Production VM (`34.45.27.247`):** Runs Ubuntu 22.04 LTS, with Apache 2.4.52 functioning as a reverse proxy. Applications are managed by PM2 on specific ports (e.g., US on 3040, UK on 3004, MX on 3030).

## IVT (Invalid Traffic) Pipeline

TopNetworks employs a robust pipeline to ensure traffic quality:

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

This pipeline classifies and visualizes bot traffic, click fraud, and invalid impression events in real-time.

## Internal Systems

### RouteGenius
Traffic distribution engine built on Next.js 16.1, Supabase, Better Auth, and Firebase. Uses probabilistic routing algorithms.

### Arbitrage Manager Dashboard
Real-time campaign analytics integrating Meta Ads API and System1 data. Uses a FastAPI (Python) backend on Cloud Run, a React/Vite frontend, and BigQuery.

### Content Generation
- **EmailGenius:** Generates email broadcasts via Vertex AI (Gemini 2.5 Flash), built on Next.js 15.5.
- **Social Media Genius:** AI-assisted social media content generation using Konva canvas and Vertex AI.

### TopAds Network
Proprietary ad network serving offer walls. Built with Node.js/Express and Docker/Nginx. Automatically injected via `AdZepNavigationHandler`.
