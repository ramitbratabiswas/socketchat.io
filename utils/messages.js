import moment from 'moment';

export const formatMessage = ( username, text ) => {
  return {
    username: username,
    text: text,
    time: moment().format('h:mm a')
  }
}