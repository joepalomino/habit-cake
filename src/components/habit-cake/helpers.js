import moment from 'moment';

export function createDayBoard(checkIns) {
  const startDate = Object.keys(checkIns).reduce(
    (lowest, key) => (checkIns[key].timeStamp < lowest ? checkIns[key].timeStamp : lowest),
    1546300800,
  );

  const day = moment.unix(startDate);

  let days = [startDate];
  for (let i = 0; i < 99; i++) {
    day.add(1, 'day');
    days = [...days, day.unix()];
  }

  const daysMap = days.map(ts => ({
    timeStamp: ts,
    checkins: Object.keys(checkIns)
      .filter(
        key => moment.unix(checkIns[key].timeStamp).dayOfYear() === moment.unix(ts).dayOfYear(),
      )
      .map(id => checkIns[id].user),
  }));

  return daysMap;
}
