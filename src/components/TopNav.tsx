import React from "react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import {
  CMDB_TRASH,
  CMDB_CREATE_BOOKMARK,
  CMDB_SAVED_BOOKMARK_MSG,
  CMDB_SEARCH,
  CMDB_DELETE_BOOKMARK,
  CMDB_REMOVED_BOOKMARK_MSG,
  CMDB_RECENTLY_ADDED,
} from "../keys";
import toast from "react-hot-toast";
import CreateBookmarkModal from "./modals/CreateBookmarkModal";

interface TopNavProps {
  setsearchinput: (str: string) => void;
  selectedFolder: any;
  searchinput: string;
  getBoomarksByFolder: (payload: object) => void;
  fetchTrash: () => void;
  folders: object[];
}

export const TopNav: React.FC<TopNavProps> = ({
  setsearchinput,
  selectedFolder,
  searchinput,
  getBoomarksByFolder,
  fetchTrash,
  folders,
}) => {
  const [isbookmarked, setisbookmarked] = React.useState(false);
  const [showModal, setshowModal] = React.useState(false);

  const isValidUrl = (urlString: string) => {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  };

  const submitCreateBookmark = async (
    title: string,
    url: string,
    folder: any
  ) => {
    if (!title || !url) {
      toast.error("Name and URL are required");
    } else if (!isValidUrl(url)) {
      toast.error("URL is invalid");
    } else {
      await chrome.runtime.sendMessage(
        {
          title,
          url,
          command: CMDB_CREATE_BOOKMARK,
          parentId:
            selectedFolder.id === CMDB_RECENTLY_ADDED ||
            selectedFolder.id === CMDB_TRASH
              ? "2"
              : folder.id,
        },
        (response) => {
          if (response) {
            toast.success(CMDB_SAVED_BOOKMARK_MSG);
            getBoomarksByFolder(selectedFolder);
            setshowModal(false);
          }
        }
      );
    }
  };

  // quick save and unsafe current tab
  const handleSaveUrl = async () => {
    const url = window.location.href;
    if (!isbookmarked) {
      setshowModal(true);
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
          {/* <span className="cmdb-version">v1.0</span> */}
        </div>
        <div className="cmdb-topnav-item">
          <form>
            <input
              value={searchinput}
              id="cmdb-search"
              placeholder="Search..."
              onChange={(e) => setsearchinput(e.target.value)}
              type="search"
            />
          </form>
        </div>
        <div className="cmdb-topnav-item cmdb-topnav-item_right">
          <>
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
        </div>
      </div>
      {/* manually add bookmark */}
      {showModal && (
        <CreateBookmarkModal
          setisopen={setshowModal}
          folders={folders}
          submitCreateBookmark={submitCreateBookmark}
          defaultSelectedFolder={selectedFolder}
        />
      )}
    </>
  );
};
