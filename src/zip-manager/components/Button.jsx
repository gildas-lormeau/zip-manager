import "./styles/TopButtonBar.css";

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
  let className;

  function handleAnimationEnd() {
    className = null;
    onClickedButton();
    onClick();
  }

  if (clickedButtonName && clickedButtonName === name) {
    className = "flashing-button";
  }
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
