import React from "react";

export const TopNav = () => {
  const handleClose = () => {
    const div_root = document.getElementById("root");
    div_root?.remove();
  };
  return (
    <div className="ext-heading">
      <span className="ext-logo-text">BKMRK.</span>
      <div>
        <input id="ext-search" placeholder="Search..." />
      </div>
      <button onClick={() => handleClose()}></button>
    </div>
  );
};
