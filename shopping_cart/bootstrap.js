import shoppingCart from './shopping_cart';
import logger from '../lib/logger';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';

const log = logger({name: 'shopping-cart'});
const ctxImpl = new ExplicitContext();
const recorder = new ConsoleRecorder(log.info.bind(log));
const tracer = new Tracer({ctxImpl, recorder});

shoppingCart('shopping-cart', log, tracer).listen(process.env.PORT || 3000);