import React from "react";
import {
  ExclamationCircleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

interface ContentProps {
  bookmarksOnView: any[];
  selectedFolder: any;
}

export const Content: React.FC<ContentProps> = ({
  bookmarksOnView,
  selectedFolder,
}) => {
  return (
    <div className="cmdb-app-content">
      {bookmarksOnView?.length === 0 ? (
        <div className="cmdb-app-content-nobookmark">
          <ExclamationCircleIcon width="34" opacity={0.4} />
          <p>Nothing to see here!</p>
        </div>
      ) : (
        <div className="cmdb-app-content-bookmarklist">
          <b className="cmdb-app-content-bookmarkheader">
            {selectedFolder?.title || "Recently added"}
          </b>
          {bookmarksOnView?.map((bookmark, index) => (
            <div key={index} className="cmdb-app-content-bookmark-item">
              <span>
                <a
                  href={bookmark.url}
                  target="_blank"
                  className="cmdb-app-content-bookmark-item_title"
                >
                  <img
                    src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}
                  />
                  {bookmark.title}
                </a>
              </span>
              <span>
                <EllipsisVerticalIcon color="white" width="18" />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
