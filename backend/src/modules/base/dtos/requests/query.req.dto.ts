import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

type SortDirection = 'asc' | 'desc';

export class QueryReqDto {
  @ApiPropertyOptional({ type: String, description: 'Search keyword' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Sort rules. Each item: field:asc|desc|1|-1.',
    example: ['field1:asc', 'field2:-1'],
  })
  @IsOptional()
  @Transform(({ value }) => parseSortArray(value))
  sort?: Record<string, SortDirection>;
}

const normalizeSortOrder = (
  value: string | number,
): SortDirection | undefined => {
  if (value === 1 || value === '1') return 'asc';
  if (value === -1 || value === '-1') return 'desc';

  const v = String(value).toLowerCase();
  if (v === 'asc' || v === 'desc') return v;
};

const parseSortArray = (
  value?: string | string[],
): Record<string, SortDirection> | undefined => {
  if (!value) return undefined;

  const rawParts = Array.isArray(value) ? value : [value];

  const flattened = rawParts
    .flatMap((v) => v.split(','))
    .map((v) => v.trim())
    .filter(Boolean);

  const entries: [string, SortDirection][] = [];
  for (const part of flattened) {
    const [key, raw] = part.split(':').map((s) => s.trim());
    if (!key || !raw) continue;

    const order = normalizeSortOrder(raw);
    if (!order) continue;

    entries.push([key, order]);
  }

  return entries.length ? Object.fromEntries(entries) : undefined;
};
