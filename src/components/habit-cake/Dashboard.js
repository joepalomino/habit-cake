import React, { Fragment, Component } from 'react';
import styled, { css as emoCSS } from 'react-emotion';
import { createDayBoard } from './helpers';
import CheckInForm from './CheckInForm';
import HelloForm from './HelloForm';
import UserStats from './UserStats';

const css = (...args) => ({ className: emoCSS(...args) });

const DaySquare = styled('li')`
  width: 20px;
  height: 20px;
  background: ${props => (props.bgColor.length === 0
    ? '#F5F7F9'
    : props.bgColor.length === 2
      ? 'linear-gradient(180deg, #2af598 0%, #009efd 100%);'
      : props.bgColor === 'zak'
        ? '#2af598'
        : '#009efd')};
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`;

function CheckInBoard({ checkIns }) {
  return (
    <Fragment>
      <ul
        {...css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          background: '#fff',
          padding: '1rem',
          borderRadius: 8,
        })}
      >
        {checkIns.map(({ checkins, timeStamp }) => (
          <DaySquare key={timeStamp} bgColor={checkins} />
        ))}
      </ul>
    </Fragment>
  );
}

class Dashboard extends Component {
  state = {
    users: null,
    checkIns: null,
    authedUser: null,
    checkInPopUp: false,
  };

  mapUsers = ({ users, checkIns }) => Object.keys(users).map(key => ({
    ...users[key],
    totalMins: users[key].checkIns.reduce((accu, id) => checkIns[id].minutes + accu, 0),
  }));

  mapCheckIns = ({ checkIns }) => createDayBoard(checkIns);

  onSelect = authedUser => this.setState(() => ({ authedUser }));

  onCheckInPopUp = (checkInPopUp = false) => this.setState(() => ({
    checkInPopUp,
  }));

  onSubmit = ({
    id, tags, minutes, timeStamp, owner: { username },
  }) => {
    this.setState((prevState) => {
      const { users, checkIns } = prevState.checkIns ? prevState : this.props;

      return {
        checkInPopUp: false,
        checkIns: {
          ...checkIns,
          [id]: {
            owner: username,
            timeStamp,
            minutes,
            tags,
            id,
          },
        },
        users: {
          ...users,
          [username]: {
            ...users[username],
            checkIns: [...users[username].checkIns, id],
            checkedInToday: true,
          },
        },
      };
    });
  };

  render() {
    const {
      users, checkIns, authedUser, checkInPopUp,
    } = this.state;

    if (!authedUser) {
      return (
        <HelloForm
          onSelect={this.onSelect}
          users={this.mapUsers(users ? this.state : this.props)}
        />
      );
    }
    return (
      <section
        {...css({
          padding: '1rem',
          background: '#F5F7F9',
          maxWidth: '415px',
          margin: 'auto',
        })}
      >
        <CheckInForm
          onSubmit={this.onSubmit}
          authedUser={authedUser}
          checkInPopUp={checkInPopUp}
          onCheckInPopUp={this.onCheckInPopUp}
        />
        <UserStats
          users={this.mapUsers(users ? this.state : this.props)}
          authedUser={authedUser}
          onCheckInPopUp={this.onCheckInPopUp}
        />
        <CheckInBoard checkIns={this.mapCheckIns(checkIns ? this.state : this.props)} />
      </section>
    );
  }
}

export default Dashboard;
