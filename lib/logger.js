import Bunyan from 'bunyan';
import bunyanBlackhole from 'bunyan-blackhole';

export default function logger(...args) {
  if (process.env.NODE_ENV === 'production') {
    return Bunyan.createLogger(...args);
  }
  return bunyanBlackhole();
}