import gulp from 'gulp';
import jasmine from 'gulp-jasmine';

gulp.task('spec', () => {
  return gulp.src('spec/**/*_spec.js').pipe(jasmine());
});