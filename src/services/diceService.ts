const generateRandomNumberInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const rollK100 = () => generateRandomNumberInRange(1, 100);

export const rollK10 = () => generateRandomNumberInRange(1, 10);

export const rollK8 = () => generateRandomNumberInRange(1, 8);

export const rollK6 = () => generateRandomNumberInRange(1, 6);

export const rollK4 = () => generateRandomNumberInRange(1, 4);

export const rollForInitiativeForEnemy = () =>
  generateRandomNumberInRange(1, 100) + generateRandomNumberInRange(20, 40);
