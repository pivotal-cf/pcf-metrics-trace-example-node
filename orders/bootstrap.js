import orders from './orders';
import logger from '../lib/logger';
import {ExplicitContext, Tracer} from 'zipkin';
import CustomRecorder from '../lib/custom_recorder'

const log = logger({name: 'orders'});
const ctxImpl = new ExplicitContext();
const recorder = new CustomRecorder(log.info.bind(log));
const tracer = new Tracer({ctxImpl, recorder});

orders('orders', log, tracer).listen(process.env.PORT || 3000);
