import * as moment from 'moment';

export const formatMessage = ( username, text ) => {
  return {
    username: username,
    text: text,
    time: moment.moment().format('h:mm a')
  }
}