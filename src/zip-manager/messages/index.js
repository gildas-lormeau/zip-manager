import * as fr_FR from "./fr-FR.js";
import * as en_US from "./en-US.js";

const LANGUAGES = {
  "fr-FR": fr_FR,
  "en-US": en_US
};

function getMessages({ i18nService }) {
  return LANGUAGES[i18nService.getLanguageId()];
}

export { getMessages };
