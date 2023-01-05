import React from "react";
import { BookmarkIcon, XMarkIcon } from "@heroicons/react/24/solid";

export const TopNav = () => {
  const handleClose = () => {
    const html = document.querySelector("html");
    if (html) html.style.overflow = "auto";
    const ext_container_elem = document.getElementsByClassName(
      "ext-container-border"
    )[0];
    ext_container_elem.classList.add("ext-container-hide");
    ext_container_elem.classList.remove("ext-container-show");

    setTimeout(() => {
      const div_root = document.getElementById("root");
      div_root?.remove();
    }, 100);
  };
  return (
    <div className="ext-heading">
      <span className="ext-logo">
        <BookmarkIcon width="16" /> BKMRK.
      </span>
      <div>
        <input id="ext-search" placeholder="Search..." />
      </div>
      <button onClick={() => handleClose()}>
        <XMarkIcon opacity={0.7} color="black" width="12" />
      </button>
    </div>
  );
};
