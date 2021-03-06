import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

import {
  clearLocalStorage,
  setupCurrentUser,
  setupRelayConnectionMocks,
  setupWorkers,
  visit,
} from 'emberclear/tests/helpers';
import { page as settings } from 'emberclear/tests/helpers/pages/settings';

const page = settings.dangerZone;

module('Acceptance | Settings | Danger Zone', function (hooks) {
  setupApplicationTest(hooks);
  setupWorkers(hooks);
  clearLocalStorage(hooks);
  setupRelayConnectionMocks(hooks);

  let path = '/settings/danger-zone';

  module('when not logged in', function (hooks) {
    hooks.beforeEach(async function () {
      await visit(path);
    });

    test('is redirected to setup', function (assert) {
      assert.equal(currentURL(), '/setup');
    });
  });

  module('when logged in', function (hooks) {
    setupCurrentUser(hooks);

    hooks.beforeEach(async function () {
      await visit(path);
    });

    test('delete messages button is visible', function (assert) {
      assert.ok(page.deleteMessages.isVisible, 'button is visible');
    });

    module('Showing the private key', function () {
      test('key is not shown by default', function (assert) {
        assert.notOk(page.privateKey.isPresent);
      });

      module('Show private key is clicked', function (hooks) {
        hooks.beforeEach(async function () {
          await page.togglePrivateKey();
        });

        test('the private key is shown', function (assert) {
          assert.ok(page.privateKey.isPresent);
          assert.ok(page.privateKey.text);
        });
      });
    });
  });
});
