export const isObject = (v: unknown): v is { [key: string]: unknown } =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
