import "./styles/TopButtonBar.css";

import { useEffect, useState } from "react";

function Button({
  name,
  title,
  label,
  disabled,
  ariaLabel,
  clickedButtonName,
  onClick,
  onClickedButton
}) {
  const [className, setClassName] = useState(null);

  function handleAnimationEnd() {
    setClassName(null);
    onClickedButton();
    onClick();
  }

  useEffect(() => {
    if (clickedButtonName && clickedButtonName === name) {
      setClassName("flashing-button");
    }
  }, [clickedButtonName, name]);
  return (
    <button
      className={className}
      title={title}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      onAnimationEnd={handleAnimationEnd}
    >
      {label}
    </button>
  );
}

export default Button;
