import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import { css as emoCSS } from 'emotion';
import Dashboard from './Dashboard';

const css = (...args) => ({ className: emoCSS(...args) });

const GET_USERS_AND_CHECKINS = gql`
  {
    users {
      name
      username
      checkins {
        id
        timeStamp
      }
    }
    checkins {
      id
      owner {
        username
      }
      createdAt
      minutes
      tags
      timeStamp
    }
  }
`;

const formatUsers = (users = []) => users.reduce((obj, { username, name, checkins }) => {
  obj[username] = {
    username,
    name,
    checkIns: checkins.map(({ id }) => id),
    checkedInToday: checkins.some(
      ({ timeStamp }) => moment.unix(timeStamp).dayOfYear() === moment().dayOfYear(),
    ),
  };

  return obj;
}, {});

const formatCheckIns = (checkIns = []) => checkIns.reduce((obj, {
  id, owner: { username }, timeStamp, minutes, tags,
}) => {
  obj[id] = {
    id,
    owner: username,
    timeStamp,
    minutes,
    tags,
  };
  return obj;
}, {});

function App() {
  return (
    <Query query={GET_USERS_AND_CHECKINS}>
      {({ loading, error, data: { users, checkins } }) => {
        if (loading) {
          return (
            <h1
              {...css({
                alignContent: 'center',
                alignItems: 'center',
                display: 'flex',
                fontFamily: 'pacifico',
                height: 600,
                justifyContent: 'center',
              })}
            >
              Loading...
            </h1>
          );
        }
        if (error) {
          return (
            <p>
              Erorr:
              {error}
            </p>
          );
        }
        return (
          <div>
            <h1 {...css({ fontFamily: 'Pacifico', padding: '1rem' })}>
              Habit
              {' '}
              <span {...css({ color: '#5CDB95' })}>Cake</span>
            </h1>
            <Dashboard users={formatUsers(users)} checkIns={formatCheckIns(checkins)} />
          </div>
        );
      }}
    </Query>
  );
}

export default App;
