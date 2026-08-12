# Mentora Design System

Generated from the UI/UX Pro Max workflow for an Arabic RTL expert marketplace / B2B mentorship service.

## Product direction
- Product: two-sided expert marketplace + professional advisory service.
- Audience: Arabic-speaking founders, marketers, professionals, learners, consultants and mentors.
- Primary goal: reduce uncertainty and get a visitor from a real problem to a trusted expert and bookable slot quickly.
- Experience keywords: trustworthy, calm, premium, practical, human, clear, modern.

## Visual style
- Primary: Trust & Authority + Minimalism.
- Secondary: Flat Design + restrained Micro-interactions.
- Avoid: heavy glassmorphism, neon/cyberpunk, excessive gradients, decorative emojis as icons, fake testimonials, fake metrics, layout-shifting hover effects.
- Use generous whitespace and strong hierarchy. Marketing pages should feel spacious; dashboards can become denser later.

## Color tokens
- Ink: #10211B
- Forest: #153E33
- Evergreen: #1C7654
- Action green: #22A06B
- Action hover: #187A52
- Mint surface: #EAF7F0
- Soft sage: #F5FAF7
- Warm canvas: #FCFBF8
- Lavender support: #F1EEFF
- Peach support: #FFF2E8
- Border: #DDE7E1
- Muted: #66756E
- White: #FFFFFF
- Critical: #B42318

Rules:
- Body text must keep WCAG AA contrast.
- Green is the action/success color, not a decorative color everywhere.
- Purple/peach are supporting surfaces only.

## Typography
- Arabic-first sans-serif stack: Cairo / Noto Sans Arabic / Tahoma / system-ui.
- Headlines: 700-900, tight but not compressed; max 2-3 lines in hero.
- Body: 400-600, line-height 1.75-1.95 for Arabic.
- Minimum mobile body size: 15px.

## Layout
- Max content width: 1200px.
- Main desktop grid: 12 columns conceptually.
- Hero: 55/45 split on wide desktop, single column below 980px.
- Breakpoints: 1200, 980, 760, 560.
- Touch targets: minimum 44x44px.
- Cards never rely on hover for essential information.

## Homepage structure
1. Sticky navigation with one primary CTA.
2. Hero: outcome-oriented promise + natural-language problem search.
3. Trust proof explaining verification, booking, Meet, local timezone.
4. Featured experts / discovery preview.
5. Problem-to-expert use cases.
6. How it works: describe problem -> pick expert -> book -> meet -> action plan.
7. Category discovery.
8. Mentor recruitment CTA.
9. Final learner CTA.

## Components
### Buttons
- Primary: forest background, white text, pill/14px radius, strong focus ring.
- Secondary: white/transparent with border.
- No movement that changes layout bounds; hover uses color/shadow/1-2px visual lift only.

### Expert cards
- Avatar/photo area, verified state, title, 2-3 skills, rating/session metadata only when real, nearest availability, clear price, clear profile CTA.
- Demo content must be explicitly labeled as demo.

### Search / matching
- Natural-language input is the dominant hero interaction.
- Show example prompts under it.
- Never imply AI certainty; matching score is advisory only.

### Motion
- Motion intensity: 5/10.
- Reveal: 350-550ms, ease-out, small translate (<=16px).
- Stagger only short card groups.
- Floating decorative motion <= 6px.
- Respect prefers-reduced-motion.
- Avoid continuous large transforms and parallax on mobile.

## Accessibility
- Semantic landmarks and headings.
- Keyboard-visible focus states.
- SVG/vector icons only for structural actions; no emoji navigation icons.
- Icon-only controls require aria-label.
- Forms require visible labels or accessible names.
- Reduced-motion mode must disable decorative animations.

## Responsive behavior
- 375px is a required test width.
- No horizontal scrolling.
- Hero input footer stacks on narrow screens.
- Expert cards become one column <= 640px.
- Sticky header simplifies to brand + primary action + menu.
- Decorative product mockups simplify/hide non-essential layers on small screens.

## Next.js implementation rules
- Prefer Server Components for static marketing content.
- Client JS only for intersection reveal and truly interactive controls.
- Keep homepage images/SVGs lightweight.
- Avoid hydration-only visual content.
- Do not import large animation frameworks for basic reveals.

## Conversion rules
- One dominant CTA per section.
- Explain why the expert is relevant before asking for payment.
- Surface trust close to booking actions: verified expert, exact duration, timezone, Meet, cancellation policy when available.
- Do not fabricate social proof; use product/process proof until real reviews exist.
