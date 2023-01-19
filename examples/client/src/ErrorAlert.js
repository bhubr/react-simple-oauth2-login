import React from 'react';

export default function ErrorAlert({ error }) {
  return (
    <div className="ErrorAlert">
      {error && error.message}
    </div>
  )
}