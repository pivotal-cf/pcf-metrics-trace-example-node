import Bunyan from 'bunyan';
import bunyanBlackhole from 'bunyan-blackhole';

export default function logger(...args) {
  if (['production', 'development'].includes(process.env.NODE_ENV)) {
    return Bunyan.createLogger(...args);
  }
  return bunyanBlackhole();
}