import {
  BadRequestException,
  ValidationError,
  ValidationPipe as VP,
} from '@nestjs/common';

export class ValidationPipe extends VP {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { exposeUnsetFields: false },
      exceptionFactory: (errors) => {
        const validationErrors = flattenValidationErrors(errors);

        return new BadRequestException({
          message: validationErrors[0]?.messages[0] ?? 'Validation failed',
          error: validationErrors,
        });
      },
    });
  }
}

/**
 * Flatten class-validator ValidationError tree
 * into a list of { path, messages }
 */
const flattenValidationErrors = (
  errors: ValidationError[],
  parentPath = '',
): { path: string; messages: string[] }[] => {
  return errors.flatMap((error) => {
    const currentPath = buildValidationPath(parentPath, error.property);

    const ownErrors = error.constraints
      ? [
          {
            path: currentPath,
            messages: Object.values(error.constraints),
          },
        ]
      : [];

    const childErrors = error.children?.length
      ? flattenValidationErrors(error.children, currentPath)
      : [];

    return [...ownErrors, ...childErrors];
  });
};

const buildValidationPath = (parentPath: string, property: string): string => {
  if (!parentPath) return property;

  // array index (e.g. seatTypes[0])
  if (/^\d+$/.test(property)) {
    return `${parentPath}[${property}]`;
  }

  return `${parentPath}.${property}`;
};
