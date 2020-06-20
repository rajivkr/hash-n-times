import Crypto from 'crypto';

export const memoizer = (func) => {
  const cache = {};
  return (n) => {
    if (cache[n] !== undefined) {
      return cache[n];
    }
    const result = func(n);
    cache[n] = result;
    return result;
  };
};

export const getSHA256 = (inputStr, hashCount) => {
  return new Promise((resolve, reject) => {
    try {
      let numberOfTimes = hashCount;
      let hashedInput;
      if (inputStr === undefined) resolve(false);
      while (numberOfTimes--) {
        const hash = Crypto.createHash('sha256');
        hash.update(inputStr);
        hashedInput = hash.digest('hex');
      }
      resolve(hashedInput);
    } catch (err) {
      reject(err);
    }
  });
};
