// Helpers to normalize API error responses into a field->message map
export function normalizeApiErrors(err) {
  const data = err?.response?.data;
  if (!data) return null;

  // Laravel style: { errors: { field: ["msg"] } }
  if (data.errors && typeof data.errors === 'object') {
    const out = {};
    Object.entries(data.errors).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length) out[k] = v[0];
      else out[k] = String(v);
    });
    return out;
  }

  // Sometimes API returns top-level fields as arrays: { field: ["msg"] }
  if (typeof data === 'object') {
    const out = {};
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length) out[k] = v[0];
    });
    if (Object.keys(out).length) return out;
    if (data.message) return { _global: data.message };
  }

  return null;
}
