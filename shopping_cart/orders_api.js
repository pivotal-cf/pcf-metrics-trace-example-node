import {fetchText} from '../helpers/fetch_helper';
import url from 'url';

export default {
  processOrder() {
    return fetchText(url.format({host: process.env.ORDERS_HOST, pathname: '/process-order'}));
  }
}