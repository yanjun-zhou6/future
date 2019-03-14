import React from "react";
import { string, func } from "prop-types";
import "./square.scss";

// eslint-disable-next-line no-use-before-define
Square.propTypes = {
  onClick: func.isRequired,
  value: string
};

// eslint-disable-next-line no-use-before-define
Square.defaultProps = {
  value: ""
};

function Square({ onClick, value = "" }) {
  return (
    <React.Fragment>
      <button className="square" onClick={onClick}>
        {value}
      </button>
    </React.Fragment>
  );
}

export default Square;
