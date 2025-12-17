import { SortByInput, SortDirection } from '../services/types/sort.type';

export const pickSortableFields = <T extends object>(
  sort: Record<string, SortDirection> | undefined,
  allowedFields?: readonly (keyof T)[],
): SortByInput<T> | undefined => {
  if (!sort || !allowedFields) return undefined;

  const result = allowedFields.reduce<SortByInput<T>>((acc, field) => {
    const value = sort[field as string];
    if (value) {
      acc[field] = value;
    }
    return acc;
  }, {});

  return Object.keys(result).length > 0 ? result : undefined;
};
