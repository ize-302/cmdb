import React from "react";
import {
  Bars2Icon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

interface TopNavProps {
  handleSearch: (str: string) => void;
  handleSaveUrl: () => void;
  isbookmarked: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  handleSearch,
  handleSaveUrl,
  isbookmarked,
}) => {
  return (
    <>
      <Tooltip
        anchorId="my-anchor-element"
        content={isbookmarked ? "Remove from bookmark" : "Bookmark this tab"}
        place="left"
      />
      <div className="cmdb-topnav">
        <div className="cmdb-topnav-item">
          <span className="cmdb-logo">⌘B</span>
          <span className="cmdb-version">v1.0</span>
        </div>
        <div className="cmdb-topnav-item">
          <input
            id="cmdb-search"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="cmdb-topnav-item cmdb-topnav-item_right">
          <button
            className="cmdb-topnav-item_right-save-url"
            onClick={() => handleSaveUrl()}
            id="my-anchor-element"
          >
            {isbookmarked ? (
              <StarIconSolid color="orange" width="16" />
            ) : (
              <StarIconOutline color="white" width="16" />
            )}
          </button>
          {/* <button>
            <Bars2Icon color="white" width="20" />
          </button> */}
        </div>
      </div>
    </>
  );
};
