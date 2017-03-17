import {fetchText} from '../helpers/fetch_helper';
import url from 'url';

export default {
  processOrder(options) {
    const u = process.env.ORDERS_HOST ? {protocol: 'http', host: process.env.ORDERS_HOST, slashes: true} : '';
    return fetchText(url.format({...u, pathname: '/process-order'}), options);
  }
}