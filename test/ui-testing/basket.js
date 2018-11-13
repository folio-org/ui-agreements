/* global Nightmare, describe, it, before, after */

// import { createAgreement } from './agreement-crud';

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-agreements: basic basket functionality', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    const number = Math.round(Math.random() * 1000);
    const values = {
      search: 'nanotech',
      agreementName: `Basketforged Agreement #${number}`,
      agreementStartDate: '2019-01-31',
      agreementRenewalPriority: 'Definitely Renew',
      agreementStatus: 'In Negotiation',
    };

    this.timeout(Number(config.test_timeout));

    describe('login > open eresources > add eresources to basket', () => {
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

      describe('create agreement from basket contents', () => {
        it(`should create a new agreement: ${values.agreementName}`, done => {
          nightmare
            .click('#basket-contents [role=listitem]:nth-of-type(2) input[type=checkbox]')
            .click('[data-test-basket-create-agreement]')
            .wait('#edit-agreement-name')
            .wait('#agreementFormEresources [role=listitem]') // An agreement line has been auto-added for the basket item
            .insert('#edit-agreement-name', values.agreementName)
            .insert('#edit-agreement-start-date', values.agreementStartDate)
            .type('#edit-agreement-status', values.agreementStatus)
            .type('#edit-agreement-renewal-priority', values.agreementRenewalPriority)
            .click('#clickable-createagreement')
            .wait('#agreementInfo')
            .then(done)
            .catch(done);
        });

        it('should see correct agreement fields', done => {
          nightmare
            .wait('#agreementInfo')
            .evaluate(expectedValues => {
              const foundName = document.querySelector('[data-test-agreement-name]').innerText;
              if (foundName !== expectedValues.agreementName) {
                throw Error(`Name of agreement is incorrect. Expected "${expectedValues.agreementName}" and got "${foundName}" `);
              }

              const foundStatus = document.querySelector('[data-test-agreement-status]').innerText;
              if (foundStatus !== expectedValues.agreementStatus) {
                throw Error(`Status of agreement is incorrect. Expected "${expectedValues.agreementStatus}" and got "${foundStatus}" `);
              }

              const foundRenewalPriority = document.querySelector('[data-test-agreement-renewal-priority]').innerText;
              if (foundRenewalPriority !== expectedValues.agreementRenewalPriority) {
                throw Error(`Renewal Priority of agreement iss incorrect. Expected "${expectedValues.agreementRenewalPriority}" and got "${foundRenewalPriority}" `);
              }
            }, values)
            .then(done)
            .catch(done);
        });

        it('should see only one agreement line', done => {
          nightmare
            .wait('section#eresources')
            .evaluate(() => {
              const lines = document.querySelectorAll('#agreement-lines [role=listitem]');

              if (lines.length !== 1) throw Error(`Expected to find 1 agreement line and found ${lines.length}`);
            })
            .then(done)
            .catch(done);
        });
      });
    });
  });
};
