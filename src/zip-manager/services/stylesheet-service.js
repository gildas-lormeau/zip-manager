/* global document */

const styleElement = document.createElement("style");
document.head.appendChild(styleElement);

function setStyle(name, value) {
  const rule = Array.from(styleElement.sheet.rules).find((rule) =>
    rule.style.getPropertyValue(name)
  );
  if (rule) {
    rule.style.setProperty(name, value);
  } else {
    styleElement.sheet.insertRule(":root { " + name + ": " + value + "}");
  }
}

export { setStyle };
