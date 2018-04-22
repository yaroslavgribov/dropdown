import React from 'react';
import PropTypes from 'prop-types';

const NativeSelect = React.forwardRef(({ options, currentValue, handleOnChange }, ref) => {
  return (
    <select 
      value={currentValue} 
      onChange={handleOnChange}
      ref={ref} 
      style={{position: 'fixed', top: '-9999px'}}
    >
      {options.map(option => {
        return (
          <option key={option}>
            {option}
          </option>
        );
      })}
    </select>
  );
});

NativeSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  currentValue: PropTypes.string,
  handleOnChange: PropTypes.func
};

export default NativeSelect;