/* global Intl */

const EN_US_LANGUAGE_ID = "en-US";

const SIZE_NUMBER_FORMATS = [
  "byte",
  "kilobyte",
  "megabyte",
  "gigabyte",
  "terabyte",
  "petabyte"
].map(
  (unit) =>
    new Intl.NumberFormat(EN_US_LANGUAGE_ID, {
      style: "unit",
      maximumFractionDigits: 1,
      unit
    })
);
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(EN_US_LANGUAGE_ID, {
  dateStyle: "short",
  timeStyle: "short"
});
const PERCENT_VALUE_FORMAT = new Intl.NumberFormat(EN_US_LANGUAGE_ID, {
  style: "unit",
  maximumFractionDigits: 0,
  unit: "percent"
});

function formatSize(number) {
  let indexNumberFormat = 0;
  while (number > 1000 && indexNumberFormat < SIZE_NUMBER_FORMATS.length - 1) {
    number = number / 1000;
    indexNumberFormat++;
  }
  return SIZE_NUMBER_FORMATS[indexNumberFormat].format(number);
}

function formatDate(date) {
  return DATE_TIME_FORMAT.format(date);
}

function formatPercentValue(value) {
  return PERCENT_VALUE_FORMAT.format(value);
}

export { formatSize, formatDate, formatPercentValue };
