import moment from 'moment';

const parseDateOnlyString = (value, _timeZone, dateFormat) => {
  return (!value || value === '') ? value : moment(value).format(dateFormat);
};

export default parseDateOnlyString;
