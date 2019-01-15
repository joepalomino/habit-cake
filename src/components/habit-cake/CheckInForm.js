import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import styled, { css as emoCSS } from 'react-emotion';

const css = (...args) => ({ className: emoCSS(...args) });

const CREATE_CHECKIN = gql`
  mutation CreateCheckin(
    $tags: CheckinCreatetagsInput!
    $username: String!
    $minutes: Int!
    $timeStamp: Int!
  ) {
    createCheckin(
      data: {
        tags: $tags
        minutes: $minutes
        timeStamp: $timeStamp
        owner: { connect: { username: $username } }
      }
    ) {
      id
      tags
      minutes
      timeStamp
      owner {
        username
      }
    }
  }
`;

const StyledForm = styled('form')`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background: #fff;
`;

const Input = styled('input')`
  background: #f5f7f9;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const SubmitCheckin = styled('button')`
  border: none;
  padding: 0.5rem 1rem;
  background: #5cdb95;
  border-radius: 8px;
  color: #fff;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.22));
`;

class CheckInForm extends Component {
  state = {
    tagsValue: '',
    minutesValue: '',
  };

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    authedUser: PropTypes.string.isRequired,
    checkInPopUp: PropTypes.bool.isRequired,
    onCheckInPopUp: PropTypes.func.isRequired,
  };

  handleInputChange = ({ target: { value, name } }) => {
    this.setState(() => ({ [name]: value }));
  };

  handleSubmit = (mutationFn) => {
    const { tagsValue, minutesValue } = this.state;
    const { authedUser, onSubmit } = this.props;
    const now = moment().unix();

    mutationFn({
      variables: {
        tags: { set: [tagsValue] },
        minutes: +minutesValue,
        username: authedUser,
        timeStamp: now, // test ts
      },
    }).then(({ data: { createCheckin } }) => onSubmit(createCheckin));
  };

  render() {
    const { tagsValue, minutesValue } = this.state;
    const { checkInPopUp, onCheckInPopUp } = this.props;
    if (!checkInPopUp) return null;
    return (
      <Mutation mutation={CREATE_CHECKIN}>
        {createCheckin => (
          <div>
            <StyledForm
              onSubmit={(e) => {
                e.preventDefault();
                this.handleSubmit(createCheckin);
              }}
            >
              <label>
                What did you work on today?
                <Input
                  name="tagsValue"
                  type="text"
                  value={tagsValue}
                  onChange={this.handleInputChange}
                  placeholder="tag"
                />
              </label>
              <label>
                How long?
                <Input
                  name="minutesValue"
                  type="number"
                  value={minutesValue}
                  onChange={this.handleInputChange}
                  placeholder="minutes"
                />
              </label>
              <div {...css({ display: 'flex', flexDirection: 'column', alignItems: 'center' })}>
                <SubmitCheckin type="submit">Submit</SubmitCheckin>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault;
                    onCheckInPopUp(false);
                  }}
                  {...css({ alignSelf: 'flex-end', color: '#DAD5D9', border: 'none' })}
                >
                  Cancel
                </button>
              </div>
            </StyledForm>
          </div>
        )}
      </Mutation>
    );
  }
}

export default CheckInForm;
