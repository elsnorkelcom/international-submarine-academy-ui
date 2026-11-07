import { z } from 'zod';

import type { AdminEntity, AdminField } from './entities';

/**
 * Builds a Zod schema from the admin entity declaration, so the form and any
 * future importer share the same validation rules.
 */
export function fieldSchema(field: AdminField): z.ZodTypeAny {
  if (field.type === 'localized' || field.type === 'localizedTextarea') {
    const base = z.object({ en: z.string(), es: z.string() });

    return field.required
      ? base.refine((value) => value.en.trim().length > 0 || value.es.trim().length > 0, {
          message: `${field.label}: write at least one language`,
        })
      : base;
  }

  if (field.type === 'number') {
    return z.union([z.number(), z.null()]);
  }

  if (field.type === 'list') {
    return z.array(z.string());
  }

  if (field.type === 'boolean') {
    return z.boolean();
  }

  const text = z.string();

  if (field.required) {
    return text.refine((value) => value.trim().length > 0, {
      message: `${field.label} is required`,
    });
  }

  return text;
}

export function entitySchema(entity: AdminEntity) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of entity.fields) {
    shape[field.key] = fieldSchema(field);
  }

  return z.object(shape);
}

export interface ValidationOutcome {
  valid: boolean;
  message: string;
}

export function validateValues(entity: AdminEntity, values: Record<string, unknown>): ValidationOutcome {
  const result = entitySchema(entity).safeParse(values);

  if (result.success) {
    return { valid: true, message: '' };
  }

  const [issue] = result.error.issues;

  return { valid: false, message: issue?.message ?? 'Invalid values' };
}
