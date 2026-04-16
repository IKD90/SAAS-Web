import React from "react";

const Modal = ({ element, close }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit {element.type}</h3>

        <input placeholder="Edit text..." />

        <button onClick={close}>Close</button>
      </div>
    </div>
  );
};

export default Modal;