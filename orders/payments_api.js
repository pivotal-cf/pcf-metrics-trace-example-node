import {fetchText} from '../helpers/fetch_helper';

export default {
  chargeCard() {
    return fetchText('/charge-card');
  }
}