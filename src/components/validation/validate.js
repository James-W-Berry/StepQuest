export function validate(form) {
  if (!(form.title && form.id && form.startDate && form.endDate)) return false;
  return true;
}

export function validateEmail(email) {
  if (!email) return false;
  if (email.length > 320 || email.indexOf("@") === -1) {
    return false;
  }

  const splits = email.split("@");
  const prefix = splits[0];
  const domain = splits[1];
  const splitsDomain = domain.split(".");
  const tld = splitsDomain[splitsDomain.length - 1];

  if (
    splits.length !== 2 ||
    splitsDomain.length < 2 ||
    prefix.length < 1 ||
    prefix.length > 64 ||
    domain.length > 255 ||
    tld.length < 2 ||
    tld.length > 4 ||
    !tld.match(/^[A-Za-z0-9]{2,4}$/)
  ) {
    return false;
  }

  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  const special = ".!#$%&'*+-/=?^_`{|}~";
  let resultPrefix = "";
  let resultDomain = "";

  prefix.split("").forEach((c) => {
    if (special.includes(c)) {
      resultPrefix += "-";
    } else if (charset.includes(c)) {
      resultPrefix += "a";
    } else {
      resultPrefix += "x";
    }
  });

  domain.split("").forEach((c) => {
    if (".-".includes(c)) {
      resultDomain += "-";
    } else if (charset.includes(c)) {
      resultDomain += "a";
    } else {
      resultDomain += "x";
    }
  });

  if (
    resultPrefix.startsWith("-") ||
    resultPrefix.endsWith("-") ||
    resultPrefix.indexOf("x") >= 0 ||
    resultPrefix.indexOf("--") >= 0 ||
    resultDomain.startsWith("-") ||
    resultDomain.endsWith("-") ||
    resultDomain.indexOf("x") >= 0 ||
    resultDomain.indexOf("--") >= 0
  ) {
    return false;
  }
  return true;
}
