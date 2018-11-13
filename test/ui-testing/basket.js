/* global Nightmare, describe, it, before, after */

// import { createAgreement } from './agreement-crud';

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-agreements: basic basket functionality', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    const values = {
      search: 'nanotech'
    };

    this.timeout(Number(config.test_timeout));

    describe('Login > open eresources > add eresources to basket > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should open eresources', done => {
        nightmare
          .wait('#clickable-agreements-module')
          .click('#clickable-agreements-module')
          .wait('#agreements-module-display')
          .click('nav #eresources')
          .wait('#input-eresource-search')
          .then(done)
          .catch(done);
      });

      it(`should search for "${values.search}"`, done => {
        nightmare
          .wait('#input-eresource-search')
          .insert('#input-eresource-search', values.search)
          .click('[data-test-search-and-sort-submit]')
          .wait(1000)
          .then(done)
          .catch(done);
      });

      it('should add two items to the basket', done => {
        nightmare
          .wait('#list-agreements [role=listitem]:nth-of-type(1) a')
          .click('#list-agreements [role=listitem]:nth-of-type(1) a')
          .wait('[data-test-add-to-basket-button]')
          .click('[data-test-add-to-basket-button]')
          .wait('[data-test-add-to-basket-button]')
          .click('[data-test-add-to-basket-button]')
          .evaluate(() => {
            const basketButton = document.querySelector('[data-test-open-basket-button]');
            if (!basketButton) throw Error('Could not find "View Basket" button');

            const basketSize = basketButton.getAttribute('data-test-basket-size');
            if (basketSize !== '2') throw Error(`Basket size is not "2" but "${basketSize}"`);
          })
          .then(done)
          .catch(done);
      });

      it('should open basket and see two items', done => {
        nightmare
          .click('[data-test-open-basket-button]')
          .wait('#basket-contents')
          .wait('#basket-contents [role=listitem]:nth-of-type(1) a')
          .wait('#basket-contents [role=listitem]:nth-of-type(2) a')
          .then(done)
          .catch(done);
      });
    });
  });
};
