import "./styles/TopButtonBar.css";

import { useEffect, useState } from "react";

function Button({
  name,
  title,
  label,
  disabled,
  clickedButtonName,
  onClick,
  onClickedButton,
  buttonRef
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
      onClick={onClick}
      onAnimationEnd={handleAnimationEnd}
      ref={buttonRef}
    >
      {label}
    </button>
  );
}

export default Button;
