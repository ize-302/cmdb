import React from "react";
import {
  Bars2Icon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import {
  PlusIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { CMDB_RECENTLY_ADDED, CMDB_TRASH } from "../keys";

interface TopNavProps {
  handleSearch: (str: string) => void;
  handleSaveUrl: () => void;
  isbookmarked: boolean;
  selectedFolder: any;
}

export const TopNav: React.FC<TopNavProps> = ({
  handleSearch,
  handleSaveUrl,
  isbookmarked,
  selectedFolder,
}) => {
  return (
    <>
      <Tooltip
        anchorId="auto-save-url"
        content={isbookmarked ? "Remove from bookmark" : "Bookmark this tab"}
        place="left"
      />
      <Tooltip
        anchorId="manual-save-url"
        content={"Add a bookmark"}
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
          {selectedFolder.id !== CMDB_TRASH && (
            <>
              <button
                className="cmdb-topnav-item_right-save-url"
                onClick={() => {}}
                id="manual-save-url"
              >
                <PlusIcon color="white" width="16" />
              </button>
              <button
                className="cmdb-topnav-item_right-save-url"
                onClick={() => handleSaveUrl()}
                id="auto-save-url"
              >
                {isbookmarked ? (
                  <StarIconSolid color="orange" width="16" />
                ) : (
                  <StarIconOutline color="white" width="16" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};
