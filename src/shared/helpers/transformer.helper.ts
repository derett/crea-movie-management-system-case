// import { classToPlain, plainToClass } from 'class-transformer';
import { forIn } from 'lodash';

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const toModel = (entity: any, dto: any, skipKeys?: string[]) => {
  forIn(dto, (value, key) => {
    if (key !== 'id') {
      if (!(skipKeys && skipKeys.includes(key))) {
        if (typeof value === 'string' && isJson(value)) {
          entity[key] = JSON.parse(value).toString();
        } else {
          entity[key] = value;
        }
      }
    }
  });
};
