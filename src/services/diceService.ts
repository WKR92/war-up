const generateRandomNumberInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const rollK100 = () => generateRandomNumberInRange(1, 100);

export const rollK20 = () => generateRandomNumberInRange(1, 20);

export const rollK12 = () => generateRandomNumberInRange(1, 12);

export const rollK10 = () => generateRandomNumberInRange(1, 10);

export const rollK8 = () => generateRandomNumberInRange(1, 8);

export const rollK6 = () => generateRandomNumberInRange(1, 6);

export const rollK4 = () => generateRandomNumberInRange(1, 4);

export const rollK2 = () => generateRandomNumberInRange(1, 2);

export const rollForInitiativeForEnemy = () =>
  generateRandomNumberInRange(1, 20) + generateRandomNumberInRange(2, 19);
