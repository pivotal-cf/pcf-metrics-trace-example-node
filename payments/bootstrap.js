import payments from './payments';
import logger from '../lib/logger';
import {ConsoleRecorder, ExplicitContext, Tracer} from 'zipkin';

const log = logger({name: 'payments'});
const ctxImpl = new ExplicitContext();
const recorder = new ConsoleRecorder(log.info.bind(log));
const tracer = new Tracer({ctxImpl, recorder});

payments('payments', log, tracer).listen(process.env.PORT || 3000);