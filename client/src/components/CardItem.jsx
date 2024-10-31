import React, { useState } from "react";
import { IoTrashSharp } from "react-icons/io5";
import ColorPicker from "./ColorPicker";

const CardItem = ({ card, onDelete, onEdit }) => {
  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingColor, setIsEditingColor] = useState(false);
  const [newText, setNewText] = useState(card.text || "");
  const [newColor, setNewColor] = useState(card.backgroundColor || "white");

  const handleTextChange = (e) => {
    setNewText(e.target.value);
  };
  const handleTextBlur = () => {
    onEdit(card.id, newText, newColor);
    setIsEditingText(false);
  };

  const handleColorSelect = (color) => {
    setNewColor(color);
    onEdit(card.id, newText, color);
    setIsEditingColor(false);
  };

  return (
    <div className="card-item" style={{ backgroundColor: newColor }}>
      {isEditingText ? (
        <input
          type="text"
          value={newText}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTextBlur();
            }
          }}
          autoFocus
        />
      ) : (
        <div onClick={() => setIsEditingText(true)}>
          {newText || (
            <span style={{ color: "#a1a09d", fontStyle: "italic" }}>
              Edit text
            </span>
          )}
        </div>
      )}
      <div className="bottom-container">
        {!isEditingColor && (
          <div className="delete-icon">
            <button onClick={() => onDelete(card.id)}>
              <IoTrashSharp />
            </button>
          </div>
        )}
        <div className="color-icon">
          {isEditingColor ? (
            <ColorPicker onColorSelect={handleColorSelect} />
          ) : (
            <button
              onClick={() => {
                setIsEditingColor(true);
                setIsEditingText(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
