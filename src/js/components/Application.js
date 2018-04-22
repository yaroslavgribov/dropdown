import React, { Component } from 'react';
import Select from './Select';

export default class Application extends Component {
  state = {
    countryNames: [],
    selectPosition: { top: 0 }
  };

  componentDidMount() {
    fetch('https://restcountries.eu/rest/v2/all')
      .then(r => r.json())
      .then(countries =>
        countries
          .map(country => country.name)
          .sort((a, b) => a.localeCompare(b))
      )
      .then(countryNames => this.setState({ countryNames }));
  }

  handleControlsClick = selectPosition => {
    this.setState({ selectPosition });
  };

  render() {
    const { countryNames } = this.state;
    return (
      <div className="demo">
        <header className="demo__header">
          <h1>Simple react dropdown list</h1>
          <ul>
            <li>enter - select an element</li>
            <li>esc - close the dropdown</li>
            <li>↑ - highlight previous item</li>
            <li>↓ - highlight next item</li>
          </ul>
        </header>
        <aside className="demo__controls">
          <button
            type="button"
            onClick={() => this.handleControlsClick({ top: 0 })}
          >
            Top
          </button>
          <button
            type="button"
            onClick={() => this.handleControlsClick({ bottom: 0 })}
          >
            Bottom
          </button>
        </aside>
        <section className="demo__container">
          <section
            className="select-container"
            style={this.state.selectPosition}
          >
            <Select placeholder={'Select a country'} options={countryNames} />
          </section>
        </section>
      </div>
    );
  }
}
