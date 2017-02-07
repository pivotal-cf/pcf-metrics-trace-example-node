import {fetchText} from '../helpers/fetch_helper';

export default {
  chargeCard(options = {}) {
    return fetchText('/charge-card', options);
  }
}