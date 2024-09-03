import { Transform } from 'class-transformer';

export interface TransformToArrayOptions {
  splitter?: string;
}

export function TransformToArray(
  options: TransformToArrayOptions = { splitter: ',' },
) {
  return Transform((value: any) => {
    return value
      .toString()
      .split(options.splitter)
      .map((item: string) => item.trim());
  });
}

export interface TransformToRangeArrayOptions extends TransformToArrayOptions {
  innerTransformer?: (value: any) => any[];
}
