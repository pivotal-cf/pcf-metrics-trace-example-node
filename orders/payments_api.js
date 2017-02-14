import {fetchText} from '../helpers/fetch_helper';
import url from 'url';

export default {
  chargeCard(options = {}) {
    const u = url.parse(process.env.PAYMENTS_HOST);
    return fetchText(url.format({...u, pathname: '/charge-card'}), options);
  }
}