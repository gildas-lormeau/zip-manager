import "./styles/TopButtonBar.css";

import { useEffect, useState } from "react";

function Button({
  name,
  title,
  label,
  disabled,
  buttonRef,
  flashingButton,
  onClick,
  onFlashingAnimationEnd
}) {
  const [className, setClassName] = useState("");

  function handleAnimationEnd() {
    setClassName(null);
    onFlashingAnimationEnd();
    if (flashingButton.callback) {
      flashingButton.callback();
    }
  }

  useEffect(() => {
    if (flashingButton && flashingButton.name === name) {
      setClassName("flashing-button");
    }
  }, [flashingButton, name]);
  return (
    <button
      className={className}
      onClick={onClick}
      onAnimationEnd={handleAnimationEnd}
      ref={buttonRef}
      title={title}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;
