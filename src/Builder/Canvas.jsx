import React from "react";

const Canvas = ({ elements, onDelete, onEdit }) => {
  return (
    <div className="canvas">
      {elements.length === 0 && (
        <div className="empty">Drag elements to start</div>
      )}

      {elements.map(el => (
        <div key={el.id} className="element">
          <div className="controls">
            <button onClick={() => onEdit(el)}>✏️</button>
            <button onClick={() => onDelete(el.id)}>🗑</button>
          </div>

{el.type === "header" && <h1>{el.content.text || 'My Store'}</h1>}
          {el.type === "hero" && <div className="hero-box">{el.content.text || 'Hero Section'}</div>}
          {el.type === "products" && (
            <div className="product-grid">
              <div className="product">{el.content.text || 'Products'}</div>
              <div className="product">{el.content.text2 || 'Product 2'}</div>
            </div>
          )}
          {el.type === "feature" && <div>⭐ {el.content.text || 'Feature'}</div>}
          {el.type === "testimonial" && <div>"{el.content.text || 'Great service!'}"</div>}
          {el.type === "newsletter" && <input placeholder={el.content.text || 'Email'} />}
          {el.type === "footer" && <footer>{el.content.text || '© Store'}</footer>}
        </div>
      ))}
    </div>
  );
};

export default Canvas;