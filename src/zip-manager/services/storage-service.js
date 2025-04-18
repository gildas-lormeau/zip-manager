/* global localStorage */

function setValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getValue(key) {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return value;
  }
}

export { setValue as set, getValue as get };
