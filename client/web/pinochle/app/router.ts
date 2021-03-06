import EmberRouter from '@ember/routing/router';

import config from 'pinochle/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('three-player');
  this.route('four-player');
  this.route('game', { path: 'game/:idOfHost/' });
});
