import React, { Component, Fragment } from 'react';
import { css } from 'emotion';
import { FaSearch } from 'react-icons/fa';
import getCities from '../utils/api';

function Suggestion({ city, population }) {
  const addCommasToNumber = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (
    <Fragment>
      <span>{city}</span>
      <span>{addCommasToNumber(population)}</span>
    </Fragment>
  );
}

const listReset = css({
  margin: 0,
  padding: 0,
});

const listItemReset = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

const pillListItem = css(listItemReset, {
  borderBottomRightRadius: 500,
  borderTopRightRadius: 500,
  color: 'white',
  display: 'flex',
  justifyContent: 'space-between',
  margin: '1rem 0',
  padding: '1rem',
  width: '70vw',
});

function SuggestionsList({ cities, filterText }) {
  const matches = (arr, str) => {
    const regex = new RegExp(str, 'gi');
    return arr.filter(({ city, state }) => regex.test(city) || regex.test(state));
  };

  const getBackgroundColor = (position) => {
    const colors = ['#FFAAD2', '#C8ABE8', '#86ABFF', '#86E8E0', '#ACFFB3'];
    return colors[position % 5];
  };

  return (
    <ul className={listReset}>
      {filterText === '' ? (
        <Fragment>
          <li className={pillListItem} style={{ background: '#86E8E0' }}>
            Search By city
          </li>
          <li className={pillListItem} style={{ background: '#ACFFB3' }}>
            Or by state
          </li>
        </Fragment>
      ) : (
        <div>
          <h2 style={{ paddingLeft: '1rem' }}>Cities</h2>
          {matches(cities, filterText).map((item, i) => (
            <li
              key={`${item.city}-${item.state}`}
              className={pillListItem}
              style={{ background: getBackgroundColor(i) }}
            >
              <Suggestion {...item} />
            </li>
          ))}
        </div>
      )}
    </ul>
  );
}

const searchInput = css({
  backgroundColor: '#DAD5D9',
  border: 'none',
  borderRadius: 8,
  color: '#9da1a3',
  maxWidth: 400,
  padding: '.5rem',
  paddingLeft: '2rem',
  width: '100%',
});

const searchIcon = css({
  color: '#9da1a3',
  left: 10,
  position: 'absolute',
  top: 9,
});

function SearchBar({ filterText, handleTextChange }) {
  const handleFilterTextChange = (e) => {
    handleTextChange(e.target.value);
  };
  return (
    <form style={{ position: 'relative' }}>
      <FaSearch className={searchIcon} />
      <input
        type="text"
        placeholder="City or State"
        value={filterText}
        onKeyUp={handleFilterTextChange}
        className={searchInput}
      />
    </form>
  );
}

const title = css({
  color: 'rgba(0, 0, 0, 0.84)',
  fontFamily: 'pacifico',
  fontSize: '2rem',
});

const container = css({
  backgroundColor: '#FCFCFD',
  maxWidth: '100%',
  overflow: 'hidden',
  padding: '1rem',
});

const loading = css({
  alignContent: 'center',
  alignItems: 'center',
  display: 'flex',
  fontFamily: 'pacifico',
  height: 600,
  justifyContent: 'center',
});

class TypeAhead extends Component {
  state = {
    filterText: '',
    cities: [],
    loading: true,
  };

  componentDidMount() {
    getCities().then((cities) => {
      this.setState(() => ({
        cities,
        loading: false,
      }));
    });
  }

  handleTextChange = (filterText) => {
    this.setState(() => ({ filterText }));
  };

  render() {
    if (this.state.loading) {
      return <h1 className={loading}>Loading...</h1>;
    }
    return (
      <div>
        <div className={container}>
          <h1 className={title}>Type Ahead</h1>
          <SearchBar handleTextChange={this.handleTextChange} />
        </div>
        <SuggestionsList {...this.state} />
      </div>
    );
  }
}

export default TypeAhead;
