import { useEffect, useRef } from "react";

function getHooks({ keyboardService, windowService }) {
  function useKeyUp(handleKeyUp) {
    const handleKeyUpRef = useRef(handleKeyUp);

    useEffect(() => {
      handleKeyUpRef.current = handleKeyUp;
    }, [handleKeyUp]);

    useEffect(() => {
      function onKeyUp(event) {
        handleKeyUpRef.current(event);
      }

      keyboardService.addKeyUpListener(onKeyUp);
      return () => keyboardService.removeKeyUpListener(onKeyUp);
    }, []);
  }

  function useKeyDown(handleKeyDown) {
    const handleKeyDownRef = useRef(handleKeyDown);

    useEffect(() => {
      handleKeyDownRef.current = handleKeyDown;
    }, [handleKeyDown]);

    useEffect(() => {
      function onKeyDown(event) {
        handleKeyDownRef.current(event);
      }

      keyboardService.addKeyDownListener(onKeyDown);
      return () => keyboardService.removeKeyDownListener(onKeyDown);
    }, []);
  }

  function usePageUnload(handlePageUnload) {
    const handlePageUnloadRef = useRef(handlePageUnload);

    useEffect(() => {
      handlePageUnloadRef.current = handlePageUnload;
    }, [handlePageUnload]);

    useEffect(() => {
      function onPageUnload(event) {
        handlePageUnloadRef.current(event);
      }

      windowService.addUnloadListener(onPageUnload);
      return () => windowService.removeUnloadListener(onPageUnload);
    }, []);
  }

  return { useKeyUp, useKeyDown, usePageUnload };
}

export { getHooks };
