import { useEffect } from "react";

function getHooks({
  addKeyUpListener,
  removeKeyUpListener,
  addKeyDownListener,
  removeKeyDownListener,
  addUnloadListener,
  removeUnloadListener
}) {
  function useKeyUp(handleKeyUp) {
    useEffect(registerKeyUpHandler);

    function registerKeyUpHandler() {
      addKeyUpListener(handleKeyUp);
      return () => removeKeyUpListener(handleKeyUp);
    }
  }

  function useKeyDown(handleKeyDown) {
    useEffect(registerKeyDownHandler);

    function registerKeyDownHandler() {
      addKeyDownListener(handleKeyDown);
      return () => removeKeyDownListener(handleKeyDown);
    }
  }

  function usePageUnload(handlePageUnload) {
    useEffect(registerPageUnloadHandler);

    function registerPageUnloadHandler() {
      addUnloadListener(handlePageUnload);
      return () => removeUnloadListener(handlePageUnload);
    }
  }

  return { useKeyUp, useKeyDown, usePageUnload };
}

export { getHooks };
