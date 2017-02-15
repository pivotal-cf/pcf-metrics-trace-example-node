import gulp from 'gulp';
import npm from 'npm';
import path from 'path';
import {spawn} from 'child_process';

gulp.task('foreman', done => {
  npm.load(function(err) {
    if (err) return done(err);
    const child = spawn(path.join(npm.bin, 'nf'), ['start', '-j', 'Procfile.dev'], {stdio: 'inherit', env: process.env}).once('close', done);
    ['SIGINT', 'SIGTERM'].forEach(e => process.once(e, () => child && child.kill()));
  });
});