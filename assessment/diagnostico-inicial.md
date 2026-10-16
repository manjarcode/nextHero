# Diagnóstico inicial de nivel — Next.js (App Router)

**Fecha:** 2026-10-14
**Nota:** 4,5 / 10 — básico-intermedio
**Metodología:** ver [metodologia-test.md](metodologia-test.md)

## Resultado por pregunta

| # | Tema | Resultado |
|---|------|-----------|
| 1 | Server vs Client Components | Correcto en lo esencial, falta matiz sobre hidratación |
| 2 | Archivos especiales (layout/loading/error/not-found) | `layout` correcto; el resto, intuición correcta pero sin conocer el mecanismo real |
| 3 | Fetch en cliente vs Server Component | Dirección correcta, falta precisión sobre waterfalls/SEO |
| 4 | Caching de `fetch` | Correcto conceptualmente, terminología aproximada |
| 5 | Server Actions | Incorrecto — confundido con API Route + fetch cliente |
| 6 | `generateStaticParams` | Desconocido |
| 7 | Streaming + Suspense | Buena intuición, término impreciso |
| 8 | Partial Prerendering (PPR) | Confundido con streaming; no distingue build-time vs runtime |
| 9 | Middleware | Desconocido — se pensaba en términos de proxy externo |
| 10 | `revalidatePath` vs `revalidateTag` | Desconocido |

## Fortalezas

- Buena base conceptual de la diferencia servidor/cliente y de las estrategias de caching de `fetch` (acertadas de memoria, las tres variantes).
- Intuición correcta sobre streaming y renderizado progresivo, aunque sin la terminología exacta.
- Honestidad al reconocer qué no se sabe en vez de inventar — esto acelera el diagnóstico y evita falsas bases.

## Puntos ciegos (prioritarios para el plan de mejora)

1. **Server Actions** — es el cambio de paradigma más grande de App Router respecto a Pages Router. Seguir pensando en API Routes + fetch cliente es la principal barrera para avanzar.
2. **Middleware / Edge Runtime** — falta de familiaridad con la capa nativa de Next, relevante también por el contexto de la migración EKS/CloudFront (dónde empieza la responsabilidad de Next frente a la del proxy/CDN).
3. **Partial Prerendering y revalidación por tag** — son las features más recientes/experimentales, con mayor valor para posicionarse como early adopter.
4. **`generateStaticParams`** — desconocido, necesario para dominar generación estática de rutas dinámicas.

## Plan de mejora

1. **Server Actions:** construir un CRUD real (formulario + mutación + `revalidatePath`) hasta que `'use server'` sea automático.
2. **Middleware:** implementar un auth guard real (cookie de sesión + redirect) con `matcher`.
3. **Caching Next 15:** repasar el cambio de defaults de `fetch` entre Next 13/14 y 15 (fuente común de confusión).
4. **Generación estática dinámica:** ejercicio con `generateStaticParams` + `dynamicParams`.
5. **Revalidación por tag:** migrar un caso de `revalidatePath` a `revalidateTag` en un escenario con dato compartido entre rutas.
6. **PPR:** montar una demo (es experimental) y documentar hallazgos — material potencial para compartir internamente como early adopter.

## Seguimiento

Repetir un test equivalente (misma metodología) al completar cada bloque del plan para medir progreso con el mismo rasero.
