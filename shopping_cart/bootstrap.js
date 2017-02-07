import shoppingCart from './shopping_cart';
import logger from '../lib/logger';

shoppingCart('shopping-cart', logger({name: 'shopping-cart'})).listen(process.env.PORT || 3000);