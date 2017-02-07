import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import plumber from 'gulp-plumber';

gulp.task('spec', () => {
  return gulp.src('spec/**/*_spec.js').pipe(plumber()).pipe(jasmine());
});