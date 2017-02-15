import {fetchText} from '../helpers/fetch_helper';
import url from 'url';

export default {
  chargeCard(options = {}) {
    const u = process.env.PAYMENTS_HOST ? {protocol: 'http', host: process.env.PAYMENTS_HOST, slashes: true} : '';
    return fetchText(url.format({...u, pathname: '/charge-card'}), options);
  }
}