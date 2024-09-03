import { Op } from 'sequelize';

import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

export default {
  transformOrder(
    order: string,
    availableAttributes: string[],
    sortOrder?: string,
  ): string[][] {
    const result = [];

    for (const sort of order.split(',')) {
      if (sort === '' || sort === '-') {
        continue;
      }

      let attribute = sort;
      let ordering = sortOrder || 'ASC';

      if (sort[sort.length - 1] === '-') {
        attribute = sort.substr(0, sort.length - 1);
        ordering = 'DESC';
      }

      if (!availableAttributes.includes(attribute)) {
        throw new ServerError(
          ServerErrorType.ORDER_OPTIONS_IS_INVALID,
          attribute,
        );
      }

      result.push([attribute, ordering]);
    }

    return result;
  },

  transformLoad(load: string, availableAttributes: string[]): string[] {
    const result = [];

    for (const attribute of load.split(',')) {
      if (attribute === '') {
        continue;
      }

      if (!availableAttributes.includes(attribute)) {
        throw new ServerError(
          ServerErrorType.LOAD_OPTIONS_IS_INVALID,
          attribute,
        );
      }

      result.push(attribute);
    }

    return result;
  },

  transformRange(value: string, parts: any[], defaultStart: any): any[] {
    if (parts.length === 1) {
      return [parts[0]];
    }

    if (value.startsWith(',')) {
      parts[0] = defaultStart;
    } else if (value.endsWith(',')) {
      return [parts[0]];
    }

    return parts;
  },

  generateRangeQuery(rangeItems: any[]): { [Op.gte]?: any; [Op.lte]?: any } {
    if (rangeItems.length === 1) {
      return {
        [Op.gte]: rangeItems[0],
      };
    } else {
      return {
        [Op.gte]: rangeItems[0],
        [Op.lte]: rangeItems[1],
      };
    }
  },

  generateLikeQuery(items: any[]): { [Op.iLike]: { [Op.any]: any } } {
    return {
      [Op.iLike]: {
        [Op.any]: items.map((item) => `%${item}%`),
      },
    };
  },

  generateSearchQuery(fields: string[], items: any[]) {
    const prefix = items[0].slice(0, 2);
    const search = items[0].slice(2);
    switch (prefix) {
      case '00': // case insensitive & search substring
        return fields.map((field) => {
          const searchItem = {
            [field]: {
              [Op.iLike]: `%${search}%`,
            },
          };

          return searchItem;
        });
      case '01': // case insensitive & search word
        return fields.map((field) => {
          const searchItem = {
            [field]: {
              [Op.match]: `${search}`,
            },
          };

          return searchItem;
        });
      case '10': // case sensitive & search substring
        return fields.map((field) => {
          const searchItem = {
            [field]: {
              [Op.like]: `%${search}%`,
            },
          };

          return searchItem;
        });
      case '11': // case sensitive & search word
        return fields.map((field) => {
          const searchItem = {
            [field]: {
              [Op.match]: `${search}`,
              [Op.like]: `%${search}%`,
            },
          };

          return searchItem;
        });
      default:
        return fields.map((field) => {
          const searchItem = {};

          //@ts-ignore
          searchItem[field] = {
            [Op.iLike]: `%${items[0]}%`,
          };
          return searchItem;
        });
    }
  },

  generateSearchQueryForNumbers(fields: string[], items: any[]) {
    return fields.map((field) => {
      const searchItem = {};

      //@ts-ignore
      searchItem[field] = {
        [Op.eq]: items.map((item) => item),
      };

      return searchItem;
    });
  },
};
