import React from "react";
import {
  Bars2Icon,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";
import {
  LinkIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { CMDB_TRASH } from "../keys";

interface TopNavProps {
  setsearchinput: (str: string) => void;
  handleSaveUrl: () => void;
  isbookmarked: boolean;
  selectedFolder: any;
  searchinput: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  setsearchinput,
  handleSaveUrl,
  isbookmarked,
  selectedFolder,
  searchinput,
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
          <form>
            <input
              value={searchinput}
              id="cmdb-search"
              placeholder="Search..."
              onChange={(e) => setsearchinput(e.target.value)}
              type="text"
            />
          </form>
        </div>
        <div className="cmdb-topnav-item cmdb-topnav-item_right">
          {selectedFolder.id !== CMDB_TRASH && (
            <>
              <button
                className="cmdb-topnav-item_right-save-url"
                onClick={() => {}}
                id="manual-save-url"
              >
                <LinkIcon color="white" width="16" />
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
