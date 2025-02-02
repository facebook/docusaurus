import React from "react";
import PropTypes from "prop-types";

const StyledComponent = ({ color, spacing }) => {
  return (
    <div style={{ color: color, marginRight: spacing + "em" }}>
      This is a styled component!
    </div>
  );
};

StyledComponent.propTypes = {
  color: PropTypes.string.isRequired,
  spacing: PropTypes.number.isRequired,
};

export default StyledComponent;
