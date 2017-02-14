import {fetchText} from '../helpers/fetch_helper';
import url from 'url';

export default {
  processOrder() {
    const u = url.parse(process.env.ORDERS_HOST); 
    return fetchText(url.format({...u, pathname: '/process-order'}));
  }
}