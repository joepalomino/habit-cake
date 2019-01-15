import React from 'react';
import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import styled, { css as emoCSS } from 'react-emotion';

const css = (...args) => ({ className: emoCSS(...args) });

const nameCard = props => emoCSS`
  color: ${!props.nameCard ? 'inherit' : props.user === 'joe' ? '#009EFD' : '#5CDB95'};
`;

const StyledCheckCircle = styled(FaCheckCircle)`
  fill: ${props => (props.checkedInToday ? '#5CDB95' : '#dad5d9')};
`;

const UserStatItem = styled('li')`
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  ${nameCard};
`;

const UserStatItemLabel = styled('p')`
  margin: 0;
  font-size: 0.5rem;
  text-align: center;
`;

function UserStatsRow({
  totalMins,
  checkIns,
  name,
  username,
  authedUser,
  onCheckInPopUp,
  checkedInToday,
}) {
  return (
    <ul
      {...css({
        display: 'flex',
        flexWrap: 'nowrap',
        fontSize: '2rem',
        marginBottom: '.5rem',
        justifyContent: 'space-between',
        WebkitJustifyContent: 'space-between',
      })}
    >
      <UserStatItem nameCard user={username}>
        {name[0]}
      </UserStatItem>
      <UserStatItem>
        {totalMins / 60}
        <UserStatItemLabel>total hrs</UserStatItemLabel>
      </UserStatItem>
      <UserStatItem>
        {(totalMins / checkIns.length).toFixed(1)}
        <UserStatItemLabel>Avg mins/day</UserStatItemLabel>
      </UserStatItem>
      <UserStatItem>
        <button
          type="button"
          onClick={
            authedUser !== username
              ? null
              : checkedInToday
                ? null
                : (e) => {
                  e.preventDefault();
                  onCheckInPopUp(true);
                }
          }
          {...css({ border: 'none' })}
        >
          <StyledCheckCircle checkedInToday={checkedInToday} />
        </button>
      </UserStatItem>
    </ul>
  );
}

UserStatsRow.propTypes = {
  totalMins: PropTypes.number.isRequired,
  checkIns: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  authedUser: PropTypes.string.isRequired,
  onCheckInPopUp: PropTypes.func.isRequired,
  checkedInToday: PropTypes.bool.isRequired,
};

function UserStats({ users, authedUser, onCheckInPopUp }) {
  return (
    <ul {...css({ marginBottom: '1rem' })}>
      {users.map(user => (
        <li key={user.username}>
          <UserStatsRow {...user} authedUser={authedUser} onCheckInPopUp={onCheckInPopUp} />
        </li>
      ))}
    </ul>
  );
}

UserStats.propTypes = {
  users: PropTypes.array.isRequired,
  authedUser: PropTypes.string.isRequired,
  onCheckInPopUp: PropTypes.func.isRequired,
};

export default UserStats;
