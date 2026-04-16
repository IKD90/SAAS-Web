import React from "react";

const Toolbar = ({ save, clear }) => {
  return (
    <div className="toolbar">
      <h3>Builder</h3>

      <div>
        <button onClick={save}>Save</button>
        <button onClick={clear}>Clear</button>
      </div>
    </div>
  );
};

export default Toolbar;