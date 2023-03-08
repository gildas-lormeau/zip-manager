import { useEffect } from "react";

function getKeyboardHooks({ addKeyListener, removeKeyListener }) {
  function useKeyUp(handleKeyUp) {
    useEffect(registerKeyUpHandler);

    function registerKeyUpHandler() {
      addKeyListener(handleKeyUp);
      return () => removeKeyListener(handleKeyUp);
    }
  }

  return { useKeyUp };
}

export { getKeyboardHooks };
