// • “Every design system starts with a <Button>. Nail this and 80% of your UI stories fall into place.”
// • Interview framing: I treat <Button> as an abstraction over the native <button>, preserving semantics while layering variants + tokens – zero runtime magic required.

import { forwardRef } from "react";
import PropTypes from "prop-types";
import "./Button.css";

/**
 * Scalable, accessible Button component
 * 1. Variant & size implemented via BEM-like modifier classes: .btn--primary, .btn--sm, etc.
 *    –> CSS-only theming; product squads can add new themes without touching JS.
 * 2. Accessibility: we forward ARIA props, expose `isLoading` which toggles `aria-busy` & a spinner.
 * 3. forwardRef keeps the component a drop-in replacement for native <button> (e.g. focus management).
 * 4. PropTypes provide runtime guardrails in an interview/greenfield setting where TypeScript may not be available.
 */

// Design-time enums double as autocomplete hints in modern IDEs.
const VARIANTS = ["primary", "secondary", "outline", "danger"];
const SIZES = ["sm", "md", "lg"];

const Button = forwardRef(function Button(
  {
    /* Visual */
    variant = "primary",
    size = "md",

    /* State */
    isLoading = false,
    disabled = false,

    /* Content */
    icon,
    iconPosition = "left", // "left" | "right"
    children,

    /* Misc – className allows consumer overrides, ...rest forwards native props */
    className = "",
    ...rest
  },
  ref
) {
  // Combine internal + external class names – interview-friendly utility vs. classnames lib.
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Disabled while loading to avoid double submits.
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="btn__spinner" aria-hidden="true" />
      )}

      {icon && iconPosition === "left" && icon}

      {/* Wrap text slot for proper spacing when icons exist */}
      <span style={{ display: "inline-flex", alignItems: "center" }}>{children}</span>

      {icon && iconPosition === "right" && icon}
    </button>
  );
});

// “Proptypes aren’t perfect but in an interview they telegraph API intent in one glance.”
Button.propTypes = {
  variant: PropTypes.oneOf(VARIANTS),
  size: PropTypes.oneOf(SIZES),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button; 