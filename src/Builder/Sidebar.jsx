import React from "react";

const items = [
  { type: "header", label: "Header" },
  { type: "hero", label: "Hero" },
  { type: "products", label: "Products" },
  { type: "feature", label: "Feature" },
  { type: "testimonial", label: "Testimonial" },
  { type: "newsletter", label: "Newsletter" },
  { type: "footer", label: "Footer" }
];

const Sidebar = ({ addElement }) => {
  return (
    <div className="sidebar">
      <h3>Drag Elements</h3>

      {items.map(item => (
        <div
          key={item.type}
          className="drag-item"
          onClick={() => addElement(item.type)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;