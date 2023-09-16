import * as fr_FR from "./fr-FR.js";
import * as en_US from "./en-US.js";
import * as de_DE from "./de-DE.js";
import * as es_ES from "./es-ES.js";
import * as it_IT from "./it-IT.js";
import * as pt_PT from "./pt-PT.js";

const LANGUAGES = {
  "fr-FR": fr_FR,
  "en-US": en_US,
  "de-DE": de_DE,
  "es-ES": es_ES,
  "it-IT": it_IT,
  "pt-PT": pt_PT
};

function getMessages({ i18nService }) {
  return LANGUAGES[i18nService.getLanguageId()];
}

export { getMessages };
