export const SortUtil = {
  parse: (sort?: string): Record<string, 1 | -1> | undefined => {
    if (!sort) return undefined;

    const result: Record<string, 1 | -1> = {};
    const fields = sort.split(',').map(f => f.trim());

    for (const f of fields) {
      const [key, dir] = f.split(':').map(s => s.trim());
      const value = Number(dir);
      if (key && (value === 1 || value === -1)) {
        result[key] = value;
      }
    }

    return Object.keys(result).length ? result : undefined;
  },
};
