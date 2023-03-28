import "./styles/TopButtonBar.css";

import { useEffect, useState } from "react";

function Button({
  name,
  title,
  label,
  disabled,
  flashingButton,
  onClick,
  onFlashingAnimationEnd,
  buttonRef
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
      title={title}
      disabled={disabled}
      onClick={onClick}
      onAnimationEnd={handleAnimationEnd}
      ref={buttonRef}
    >
      {label}
    </button>
  );
}

export default Button;
