/* global Intl, navigator */

const DEFAULT_LANGUAGE_ID = "en-US";
const LANGUAGE_IDS = [DEFAULT_LANGUAGE_ID, "de-DE", "es-ES", "fr-FR", "it-IT", "pt-PT"];

const SIZE_NUMBER_FORMATS = [
  "kilobyte",
  "megabyte",
  "gigabyte",
  "terabyte",
  "petabyte"
].map(
  (unit) =>
    new Intl.NumberFormat(getLanguageId(), {
      style: "unit",
      maximumFractionDigits: 1,
      unit
    })
);
const DATE_TIME_FORMAT = new Intl.DateTimeFormat(getLanguageId(), {
  dateStyle: "short",
  timeStyle: "short"
});
const PERCENT_VALUE_FORMAT = new Intl.NumberFormat(getLanguageId(), {
  style: "unit",
  maximumFractionDigits: 0,
  unit: "percent"
});

function formatSize(number) {
  let indexNumberFormat = 0;
  number = number / 1000;
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

function getLanguageId() {
  return LANGUAGE_IDS.includes(navigator.language)
    ? navigator.language
    : DEFAULT_LANGUAGE_ID;
}

export { formatSize, formatDate, formatPercentValue, getLanguageId };
