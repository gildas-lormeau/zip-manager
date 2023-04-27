import * as fr_FR from "./fr-FR.js";
import * as en_US from "./en-US.js";

const LANGUAGES = {
  "fr-FR": fr_FR,
  "en-US": en_US
};
const DEFAULT_LANGUAGE = "en-US";

function getMessages({ util }) {
  return LANGUAGES[util.getNavigatorLanguage()] || LANGUAGES[DEFAULT_LANGUAGE];
}

export { getMessages };
