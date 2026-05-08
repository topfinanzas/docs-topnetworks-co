# Shared Functions & Utilities

TopNetworks codebases share a set of common utility patterns to handle formatting, tracking, routing, and API interactions.

## UTM Tracking & Attribution

A critical component of the arbitrage loop is ensuring every session is tracked from acquisition to conversion.

- **UTM Structure:** `[country]_tf_[platform]_broad`
  - Example: `us_tf_meta_broad`
- **Utility Functions:** Functions to parse, persist, and append UTM parameters to all outbound CPA links.

## Formatting Utilities

- **Currency Formatting:** `formatCurrency(amount, currencyCode)` to handle USD, GBP, and MXN correctly based on the active locale.
- **Date Formatting:** Standardized date formatting utilities using native `Intl.DateTimeFormat`.
- **String Manipulation:** Utilities for generating URL-safe slugs and formatting text for UI display.

## Analytics Integration

- **GTM (Google Tag Manager):** Standardized dataLayer push utilities for tracking page views, lead submissions, and outbound clicks.
- **Google Analytics 4:** Event tracking wrappers.

## Cloud & API Utilities

- **Google Cloud Storage:** Utilities for generating signed URLs or reading assets directly from the `media-topfinanzas-com` bucket.
- **BigQuery Logging:** Functions to asynchronously log IVT signals and session metrics.

## AI Generation Wrappers

For internal tools like `EmailGenius` and `SocialMediaGenius`, we wrap the `@google/genai` and `@modelcontextprotocol/sdk` libraries:

- **Prompt Engineering Builders:** Utilities to assemble context, rules, and input variables into structured prompts for Gemini 2.5 Flash.
- **Response Parsers:** Functions to validate and parse structured JSON output from LLMs using Zod.
