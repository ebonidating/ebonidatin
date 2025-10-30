import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: 'https://50fd1af202ca48e3b9ea1fd11b4e1f39@ebobidatin.bugsink.com/1',
    tracesSampleRate: 1.0,
    debug: false,
  });
}
