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
import {
  CMDB_TRASH,
  CMDB_CREATE_BOOKMARK,
  CMDB_SAVED_BOOKMARK_MSG,
  CMDB_SEARCH,
  CMDB_DELETE_BOOKMARK,
  CMDB_REMOVED_BOOKMARK_MSG,
} from "../keys";
import cheerio from "cheerio";
import axios from "axios";
import toast from "react-hot-toast";

interface TopNavProps {
  setsearchinput: (str: string) => void;
  selectedFolder: any;
  searchinput: string;
  getBoomarksByFolder: (payload: object) => void;
  fetchTrash: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  setsearchinput,
  selectedFolder,
  searchinput,
  getBoomarksByFolder,
  fetchTrash,
}) => {
  const [isbookmarked, setisbookmarked] = React.useState(false);

  // quick save and unsafe current tab
  const handleSaveUrl = async () => {
    const url = window.location.href;
    if (!isbookmarked) {
      const parentId = selectedFolder.title ? selectedFolder?.id : null;
      const command = CMDB_CREATE_BOOKMARK;
      try {
        const response = axios.get(url);
        var $ = cheerio.load((await response).data);
        var title = $("title").text();
        chrome.runtime.sendMessage(
          { title, url, command, parentId },
          (response) => {
            if (response) {
              toast.success(CMDB_SAVED_BOOKMARK_MSG);
              getBoomarksByFolder(selectedFolder);
            }
          }
        );
      } catch (error) {
        console.log("error => ", error);
      }
    } else {
      const currenturl = window.location.href;
      chrome.runtime.sendMessage(
        { string: currenturl, command: CMDB_SEARCH },
        (result) => {
          chrome.runtime.sendMessage(
            { bookmarks: [...result], command: CMDB_DELETE_BOOKMARK },
            (result) => {
              if (result === "deleted") {
                toast.success(CMDB_REMOVED_BOOKMARK_MSG);
                getBoomarksByFolder(selectedFolder);
                fetchTrash();
              }
            }
          );
        }
      );
    }
  };

  React.useEffect(() => {
    const currenturl = window.location.href;
    chrome.runtime.sendMessage(
      { string: currenturl, command: CMDB_SEARCH },
      (result) => {
        result.length > 0 ? setisbookmarked(true) : setisbookmarked(false);
      }
    );
  }, [window, handleSaveUrl]);

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
