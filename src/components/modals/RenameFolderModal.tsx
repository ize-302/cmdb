import * as React from "react";
import { useOutsideAlerter } from "../Menu";

interface RenameFolderModalProps {
  setisopen: (value: boolean) => void;
  submit: (folder: string, title: string) => void;
  folders?: any[];
  defaultSelectedFolder: any;
}

const RenameFolderModal: React.FC<RenameFolderModalProps> = ({
  setisopen,
  submit,
  defaultSelectedFolder,
}) => {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, setisopen);
  const [title, settitle] = React.useState(defaultSelectedFolder.title);

  return (
    <div className="cmdb-modal">
      <div className="cmdb-modal-backdrop" />
      <div ref={wrapperRef} className="cmdb-modal-content">
        <div className="cmdb-modal-title">Rename folder</div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(defaultSelectedFolder.id, title);
          }}
        >
          <label className="cmdb-label">New name</label>
          <input
            className="cmdb-input"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
          <div className="cmdb-modal-footer">
            <button
              type="button"
              onClick={() => setisopen(false)}
              className="cmdb-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="cmdb-primary">
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameFolderModal;
