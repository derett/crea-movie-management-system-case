import {
  registerDecorator,
  ValidationOptions,
  isUUID,
  ValidationArguments,
  isDefined,
  arrayMinSize,
  arrayMaxSize,
  arrayUnique,
  matches,
} from 'class-validator';

export interface IsUUIDArrayOptions {
  arrayMinSize?: number;
  arrayMaxSize?: number;
  arrayUnique?: boolean;
}

export function IsUUIDArray(
  options?: IsUUIDArrayOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUUIDArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (
            isDefined(options.arrayMinSize) &&
            !arrayMinSize(value, options.arrayMinSize)
          ) {
            return false;
          }

          if (
            isDefined(options.arrayMaxSize) &&
            !arrayMaxSize(value, options.arrayMaxSize)
          ) {
            return false;
          }

          if (isDefined(options.arrayUnique) && !arrayUnique(value)) {
            return false;
          }

          return value.reduce(
            (prev: boolean, curr: string) => prev && isUUID(curr, 4),
            true,
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `Expected a UUID array for "${args.property}" but got "${args.value}"`;
        },
      },
    });
  };
}

export interface IsStringArrayOptions {
  arrayMinSize?: number;
  arrayMaxSize?: number;
  arrayUnique?: boolean;
  minLength?: number;
  maxLength?: number;
  matches?: RegExp;
}

export function IsStringArray(
  options?: IsStringArrayOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isStringArray',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string[]) {
          if (
            isDefined(options.arrayMinSize) &&
            !arrayMinSize(value, options.arrayMinSize)
          ) {
            return false;
          }

          if (
            isDefined(options.arrayMaxSize) &&
            !arrayMaxSize(value, options.arrayMaxSize)
          ) {
            return false;
          }

          if (isDefined(options.arrayUnique) && !arrayUnique(value)) {
            return false;
          }

          for (const item of value) {
            if (
              isDefined(options.minLength) &&
              item.length < options.minLength
            ) {
              return false;
            }

            if (
              isDefined(options.maxLength) &&
              item.length > options.maxLength
            ) {
              return false;
            }

            if (isDefined(options.matches) && !matches(item, options.matches)) {
              return false;
            }
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `Expected a string array with given options, "${JSON.stringify(
            options,
          )}" for "${args.property}" but got "${args.value}"`;
        },
      },
    });
  };
}
