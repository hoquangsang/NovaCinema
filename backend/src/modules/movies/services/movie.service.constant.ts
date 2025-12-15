export const MovieQueryFields = {
  SEARCHABLE: ['title','director','producer','genres','actors'],
  REGEX_MATCH: ['title','director','producer'],
  ARRAY_MATCH: ['genres','actors'],
  EXACT_MATCH: ['ratingAge','country','language'],
  SORTABLE: ['title', 'duration', 'releaseDate', 'endDate', 'ratingAge', 'country', 'language'],
} as const;
