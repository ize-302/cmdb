import * as React from "react";
import { useOutsideAlerter } from "../Menu";
import { BookmarkProps } from "../../types";

interface EditBookmarkModalProps {
  bookmark: any;
  setisopen: (payload: boolean) => void;
  submitEditBookmark: (payload: BookmarkProps) => void;
}

const EditBookmarkModal: React.FC<EditBookmarkModalProps> = ({
  bookmark,
  setisopen,
  submitEditBookmark,
}) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, setisopen);
  const [title, settitle] = React.useState(bookmark?.title);
  const [url, seturl] = React.useState(bookmark?.url);

  const handleSubmit = () => {
    if (bookmark) {
      submitEditBookmark({ title, url, id: bookmark.id });
    }
  };

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">
          {bookmark.url ? "Edit bookmark" : "Rename folder"}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <label className="cmdb-label">Name</label>
          <input
            className="cmdb-input"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
          {bookmark.url && (
            <>
              <label className="cmdb-label">URL</label>
              <input
                className="cmdb-input"
                value={url}
                onChange={(e) => seturl(e.target.value)}
              />
            </>
          )}
          <div className="cmdb-modal-footer">
            <button
              type="button"
              onClick={() => setisopen(false)}
              className="cmdb-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="cmdb-primary">
              {bookmark.url ? "Update" : "Rename"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookmarkModal;
