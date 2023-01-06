import React from "react";
import { BookmarkIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ShareIcon, Bars2Icon } from "@heroicons/react/24/solid";

interface TopNavProps {
  handleSearch: (str: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ handleSearch }) => {
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
      <div className="ext-logo">⌘B</div>
      <div>
        <input
          id="ext-search"
          placeholder="Search..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <button>
        <Bars2Icon color="white" width="20" />
      </button>
    </div>
  );
};
