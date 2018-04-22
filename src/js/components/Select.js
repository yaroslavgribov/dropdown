import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import NativeSelect from './NativeSelect';

const toLowerCase = item => item.toLowerCase();
const compose = (...fns) =>
  fns.reduceRight(
    (prevFn, nextFn) => value => nextFn(prevFn(value)),
    value => value
  );

const search = query => text => {
  const queryFirstIndex = text.toLowerCase().indexOf(query);

  if (queryFirstIndex === -1) return [text, '', ''];

  const before = text.slice(0, queryFirstIndex);
  const highlight = text.slice(queryFirstIndex, queryFirstIndex + query.length);
  const after = text.slice(queryFirstIndex + query.length, text.length);

  return [before, highlight, after];
};

const keyMap = {
  esc: 27,
  enter: 13,
  arrowDown: 40,
  arrowUp: 38
};

class Select extends Component {
  state = {
    query: '',
    highlightedIndex: 0,
    isOpen: false,
    hasFocus: false
  };

  mouseIsIn = false;

  componentDidMount() {
    this.setState({
      hasTouchEvents: window.orientation > -1
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.hasTouchEvents) {
      if (this.state.hasFocus === false) {
        this.inputRef.blur();
      }

      if (prevState.isOpen === false && this.state.isOpen === true) {
        const selectRect = this.selectRef.getBoundingClientRect();
        if (selectRect.bottom > window.innerHeight) {
          this.selectRef.classList.add('select__list--top');
          this.inputContainerRef.classList.add('select__input--top');
        } else {
          this.selectRef.classList.add('select__list--bottom');
          this.inputContainerRef.classList.add('select__input--bottom');
        }
      }

      if (this.state.highlightedIndex !== prevState.highlightedIndex) {
        const selectElement = this.selectRef;
        const highlightedItem = this.highlightedItem;

        const selectRect = selectElement.getBoundingClientRect();
        const highlightedRect = highlightedItem.getBoundingClientRect();

        if (highlightedRect.top < selectRect.top) {
          highlightedItem.scrollIntoView({ block: 'start' });
          return;
        }

        if (highlightedRect.bottom > selectRect.bottom) {
          highlightedItem.scrollIntoView({ block: 'end' });
          return;
        }
      }
    }
  }

  handleInputFocus = () => {
    this.setState({ isOpen: true, hasFocus: true }, () =>
      this.setState({ highlightedIndex: 0 })
    );

    this.state.hasTouchEvents && this.nativeSelect.focus();
  };

  handleInputBlur = () => {
    if (this.mouseIsIn === false) {
      this.setState({ isOpen: false, hasFocus: false });
    }
  };

  handleInputChange = ({ target: { value } }) =>
    this.setState({ query: value, isOpen: true, highlightedIndex: 0 });

  handleInputKeyDown = options => event => {
    if (Object.values(keyMap).includes(event.keyCode)) {
      event.preventDefault();
    }

    switch (event.keyCode) {
      case keyMap.arrowDown:
        if (options.length) {
          this.setState({
            highlightedIndex:
              this.state.highlightedIndex + 1 === options.length
                ? this.state.highlightedIndex
                : this.state.highlightedIndex + 1
          });
        }
        break;
      case keyMap.arrowUp:
        if (options.length) {
          this.setState({
            highlightedIndex:
              this.state.highlightedIndex === 0
                ? this.state.highlightedIndex
                : this.state.highlightedIndex - 1
          });
        }
        break;
      case keyMap.enter:
        this.setState({
          query: options[this.state.highlightedIndex] || this.state.query,
          isOpen: false,
          hasFocus: false
        });
        break;
      case keyMap.esc:
        this.setState({
          isOpen: false,
          hasFocus: false
        });

        break;
      default:
        break;
    }
  };

  handleItemClick = item => {
    this.setState({ query: item, isOpen: false }, () =>
      this.setState({ hasFocus: false })
    );
  };

  handleMouseEnter = () => {
    this.mouseIsIn = true;
  };

  handleMouseLeave = () => {
    this.mouseIsIn = false;
  };

  render() {
    const filteredList = this.props.options.filter(item =>
      item.toLowerCase().includes(this.state.query.toLowerCase())
    );

    const selectListClass = classNames('select__list', {
      'select__list--open': this.state.isOpen
    });

    const inputContainerClass = classNames('select__input', {
      'select__input--focused': this.state.hasFocus || this.state.query.length,
      'select__input--open': this.state.isOpen
    });

    return (
      <div className="select">
        <div
          className={inputContainerClass}
          ref={element => (this.inputContainerRef = element)}
        >
          <label htmlFor="typeaheadInput" className="select__placeholder">
            {this.props.placeholder}
          </label>
          <input
            type="text"
            id="typeaheadInput"
            value={this.state.query}
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown(filteredList)}
            ref={element => (this.inputRef = element)}
          />
          <i className="chevron">&#x25BC;</i>
        </div>
        {this.state.hasTouchEvents ? (
          <NativeSelect
            ref={element => (this.nativeSelect = element)}
            options={this.props.options}
            currentValue={this.state.query}
            handleOnChange={this.handleInputChange}
          />
        ) : (
          <div
            className={selectListClass}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            ref={element => (this.selectRef = element)}
          >
            {filteredList.length > 0 &&
              filteredList.map((item, index) => {
                const itemClass = classNames('select__item', {
                  'select__item--highlight':
                    this.state.highlightedIndex === index
                });

                const highlight = compose(search, toLowerCase);
                const highlightQuery = highlight(this.state.query);
                const highlightedItem = highlightQuery(item);

                return (
                  <div
                    key={item}
                    className={itemClass}
                    onClick={() => this.handleItemClick(item)}
                    ref={element =>
                      this.state.highlightedIndex === index
                        ? (this.highlightedItem = element)
                        : null
                    }
                  >
                    {highlightedItem[0]}
                    <span className="highlight">{highlightedItem[1]}</span>
                    {highlightedItem[2]}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string),
  placeholder: PropTypes.string
};

export default Select;
