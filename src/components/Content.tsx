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
    <div className="ext-content">
      {bookmarksOnView?.length === 0 ? (
        <div className="ext-content-nobookmark">
          <ExclamationCircleIcon width="34" opacity={0.4} />
          <p>Nothing to see here!</p>
        </div>
      ) : (
        <div className="ext-content-bookmarklist">
          <b className="ext-content-bookmarkheader">
            {selectedFolder?.title || "Recently added"}
          </b>
          {bookmarksOnView?.map((bookmark, index) => (
            <div key={index} className="ext-content-bookmark-item">
              <div className="ext-content-bookmark-item_title">
                <img
                  src={`http://www.google.com/s2/favicons?domain=${bookmark.url}`}
                />
                {bookmark.title}
              </div>
              <div>
                <EllipsisVerticalIcon color="white" width="18" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
