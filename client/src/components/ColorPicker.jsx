import React from 'react';

const colors = ['#FF5733', '#33FF57', "#FF9D3D", "#FFE700","#006A67"];

const ColorPicker = ({ onColorSelect }) => {
  return (
    <div className='color-picker-container'>
      {colors.map((color) => (
        <div
          key={color}
          className="color-circle"
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
        ></div>
      ))}
    </div>
  );
};

export default ColorPicker;
