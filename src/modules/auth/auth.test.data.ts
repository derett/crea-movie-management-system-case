import { RegisterDataDto } from './dto/register-data.dto';
import { faker } from '@faker-js/faker';

function randomRegisterData(): RegisterDataDto {
  const password = faker.string.alpha(10);
  return {
    username: faker.internet.userName(),
    password,
    passwordConfirmation: password,
    age: faker.number.int({ min: 10, max: 50 }),
  };
}

const users = faker.helpers.multiple(randomRegisterData, { count: 5 });

export default {
  users,
  randContent: randomRegisterData(),
  pickOne: users[Math.floor(Math.random() * users.length)],
};
