import orders from './orders';
import logger from '../lib/logger';

orders('orders', logger({name: 'orders'})).listen(process.env.PORT || 3000);