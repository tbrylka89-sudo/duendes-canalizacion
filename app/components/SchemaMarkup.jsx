// ═══════════════════════════════════════════════════════════════════════════════
// SCHEMA MARKUP COMPONENT
// Inyecta JSON-LD estructurado en el head para SEO
// ═══════════════════════════════════════════════════════════════════════════════

import { serializeSchema } from '@/lib/seo/schema';

/**
 * Componente para renderizar Schema Markup JSON-LD
 *
 * Uso:
 * <SchemaMarkup schema={generateOrganizationSchema()} />
 *
 * O con multiples schemas:
 * <SchemaMarkup schema={combineSchemas(schema1, schema2)} />
 *
 * @param {Object} props
 * @param {Object|null} props.schema - El schema JSON-LD a renderizar
 */
export default function SchemaMarkup({ schema }) {
  // No renderizar si no hay schema
  if (!schema) {
    return null;
  }

  // Serializar el schema de forma segura
  const jsonLd = serializeSchema(schema);

  if (!jsonLd) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}

/**
 * Componente para renderizar multiples schemas
 * Util cuando necesitas schemas separados en lugar de un @graph
 *
 * @param {Object} props
 * @param {Array<Object>} props.schemas - Array de schemas JSON-LD
 */
export function MultipleSchemaMarkup({ schemas }) {
  if (!schemas || !Array.isArray(schemas) || schemas.length === 0) {
    return null;
  }

  return (
    <>
      {schemas.filter(Boolean).map((schema, index) => (
        <SchemaMarkup key={index} schema={schema} />
      ))}
    </>
  );
}
