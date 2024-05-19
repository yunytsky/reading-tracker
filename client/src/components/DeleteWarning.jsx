import { forwardRef } from "react";
import warningIcon from "../assets/warning.svg";

const DeleteWarning = forwardRef(({ message, onCancel, onDelete }, ref) => {
    return (
      <div className="delete-warning" ref={ref}>
        <img src={warningIcon} alt="warning" />
        <h4>Are you sure?</h4>
        <p>{message}</p>
        <div className="delete-warning-buttons">
          <button
            className="delete-warning-cancel-button button empty"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="delete-warning-delete-button button red"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    );
});

export default DeleteWarning;