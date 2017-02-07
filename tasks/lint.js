import gulp from 'gulp';
import eslint from 'gulp-eslint';
import {log, colors} from 'gulp-util';
import plumber from 'gulp-plumber';
import gulpIf from 'gulp-if';

const lintGlob = ['tasks/**/.js', 'payments/**/*.js', 'spec/**/*.js'];

gulp.task('lint', () => {
  const {FIX: fix = true} = process.env;
  return gulp.src(lintGlob, {base: '.'})
    .pipe(plumber())
    .pipe(eslint({fix}))
    .pipe(eslint.format('stylish'))
    .pipe(gulpIf(file => {
        const fixed = file.eslint && typeof file.eslint.output === 'string';

        if(fixed) {
          log(colors.yellow(`fixed an error in ${file.eslint.filePath}`));
          return true;
        }
        return false;
      },
      gulp.dest('.'))
    )
    .pipe(eslint.failAfterError());
});