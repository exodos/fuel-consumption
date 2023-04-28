const chars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
let length = 6;

export const GetCAPTCHACode = () => {
  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = "";
  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export const verifyRecaptcha = async (rechaptchText, userText) => {
  const compare = rechaptchText.localeCompare(userText);
  return compare === 0 ? true : false;
};
