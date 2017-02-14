import {fetchText} from '../helpers/fetch_helper';
import url from 'url';

export default {
  chargeCard(options = {}) {
    return fetchText(url.format({host: process.env.PAYMENTS_HOST, pathname: '/charge-card'}), options);
  }
}