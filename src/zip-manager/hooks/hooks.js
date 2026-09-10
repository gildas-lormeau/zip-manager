import { useEffect, useEffectEvent } from "react";

function getHooks({ keyboardService, windowService }) {
  function useKeyUp(handleKeyUp) {
    const handleKeyUpEvent = useEffectEvent(handleKeyUp);

    useEffect(() => {
      function onKeyUp(event) {
        handleKeyUpEvent(event);
      }

      keyboardService.addKeyUpListener(onKeyUp);
      return () => keyboardService.removeKeyUpListener(onKeyUp);
    }, []);
  }

  function useKeyDown(handleKeyDown) {
    const handleKeyDownEvent = useEffectEvent(handleKeyDown);

    useEffect(() => {
      function onKeyDown(event) {
        handleKeyDownEvent(event);
      }

      keyboardService.addKeyDownListener(onKeyDown);
      return () => keyboardService.removeKeyDownListener(onKeyDown);
    }, []);
  }

  function usePageUnload(handlePageUnload) {
    const handlePageUnloadEvent = useEffectEvent(handlePageUnload);

    useEffect(() => {
      function onPageUnload(event) {
        handlePageUnloadEvent(event);
      }

      windowService.addUnloadListener(onPageUnload);
      return () => windowService.removeUnloadListener(onPageUnload);
    }, []);
  }

  return { useKeyUp, useKeyDown, usePageUnload };
}

export { getHooks };
