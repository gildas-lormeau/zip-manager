import { useEffect } from "react";
import { addKeyListener, removeKeyListener } from "./helpers/util.js";

function useKeyUp(handleKeyUp) {
  useEffect(registerKeyUpHandler);

  function registerKeyUpHandler() {
    addKeyListener(handleKeyUp);
    return () => removeKeyListener(handleKeyUp);
  }
}

export { useKeyUp };
