import React from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { css as emoCSS } from 'emotion';

const css = (...args) => ({ className: emoCSS(...args) });

const HelloTitle = styled('h1')`
  text-align: center;
`;

const UserButton = styled('button')`
  margin: 2rem;
  border: none;
  padding: ${props => (props.user === 'zak' ? '1.5rem 4rem' : '1.5rem 2.5rem')};
  background: white;
  border: 3px solid rgba(0, 0, 0, 0.84);
  border-radius: 8px;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.22));
  &:hover {
    background: #5cdb95;
    color: white;
  }
`;

function HelloForm({ users, onSelect }) {
  return (
    <div>
      <HelloTitle>Hello, who are you?</HelloTitle>
      <ul
        {...css({
          textAlign: 'center',
          background: '#F5F7F9',
          height: '70vh',
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
        })}
      >
        {users.map(({ name, username }) => (
          <li key={username}>
            <UserButton
              user={username}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSelect(username);
              }}
            >
              {name}
            </UserButton>
          </li>
        ))}
      </ul>
    </div>
  );
}

HelloForm.propTypes = {
  onSelect: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

export default HelloForm;
