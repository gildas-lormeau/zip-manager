import { useEffect } from "react";

function getHooks({
  addKeyListener,
  removeKeyListener,
  addUnloadListener,
  removeUnloadListener
}) {
  function useKeyUp(handleKeyUp) {
    useEffect(registerKeyUpHandler);

    function registerKeyUpHandler() {
      addKeyListener(handleKeyUp);
      return () => removeKeyListener(handleKeyUp);
    }
  }

  function usePageUnload(handlePageUnload) {
    useEffect(registerPageUnloadHandler);

    function registerPageUnloadHandler() {
      addUnloadListener(handlePageUnload);
      return () => removeUnloadListener(handlePageUnload);
    }
  }

  return { useKeyUp, usePageUnload };
}

export default getHooks;
