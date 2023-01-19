import React from 'react';
import PropTypes from 'prop-types';

function ErrorAlert({ error }) {
  return <div className="ErrorAlert">{error && error.message}</div>;
}

ErrorAlert.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};

export default ErrorAlert;
