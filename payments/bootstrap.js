import payments from './payments';
import logger from '../lib/logger';

payments('payments', logger({name: 'payments'})).listen(process.env.PORT || 3000);