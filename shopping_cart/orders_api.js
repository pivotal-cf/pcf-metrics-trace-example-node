import {fetchText} from '../helpers/fetch_helper';

export default {
  processOrder() {
    return fetchText('/process-order');
  }
}