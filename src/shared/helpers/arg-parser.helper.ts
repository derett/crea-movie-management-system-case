import { isIP, isNumberString } from 'class-validator';
import { ServerError, ServerErrorType } from 'src/shared/configs/errors.config';

const availableArgs: string[] = [];

interface Arguments {}

const args: Arguments = {};

for (const arg of process.argv) {
  if (!arg.startsWith('--')) {
    continue;
  }
  const splitedArg = arg.slice(2).split('=');

  if (splitedArg.length !== 2) {
    throw new ServerError(ServerErrorType.INVALID_ARGS, arg);
  }

  const key = splitedArg[0];

  let value: number | string;
  if (isNumberString(splitedArg[1])) {
    value = +splitedArg[1];
  } else {
    value = splitedArg[1];
    if (!isIP(value)) {
      throw new ServerError(ServerErrorType.IP_IS_INVALID, value);
    }
  }

  if (!availableArgs.includes(key)) {
    continue;
  }

  // @ts-ignore
  args[key] = value;
}

export default args;
