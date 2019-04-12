/* global describe, it, before, after, Nightmare */
const AgreementCRUD = require('./agreement-crud');

module.exports.test = (uiTestCtx) => {
  const number = Math.round(Math.random() * 100000);
  const testTag = `test${Math.floor(Math.random() * 10000)}`;
  const agreement = {
    name: `Linked License Agreement #${number}`,
  };

  describe('Login > Enable Tags > Find user > Create Tags > Logout\n', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    nightmare.options.width = 1000; // added this temporarily as MultiSelect doesnt work well with narrow screen sizes

    this.timeout(Number(config.test_timeout));

    describe('login > create license > edit terms > create agreement > link license > check term > logout', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should Enable tags in settings', done => {
        nightmare
          .wait(config.select.settings)
          .click(config.select.settings)
          .wait('#app-list-item-clickable-settings')
          .wait('a[href="/settings/tags"]')
          .click('a[href="/settings/tags"]')
          .wait('a[href="/settings/tags/general"]')
          .click('a[href="/settings/tags/general"]')
          .wait('#tags_enabled')
          .wait(222)
          .evaluate(() => {
            const element = document.querySelector('[value="true"]');
            element.click();
          })
          .then(() => {
            nightmare
              .wait(222)
              .wait('#tags_enabled')
              .click('#tags_enabled')
              .wait('#clickable-save-config')
              .click('#clickable-save-config')
              .then(done)
              .catch(done);
          });
      });

      it('should open Agreements app', done => {
        helpers.clickApp(nightmare, done, 'agreements');
      });

      it('should confirm correct URL', done => {
        nightmare
          .evaluate(() => document.location.pathname)
          .then(pathName => {
            if (!pathName.includes('/erm/agreements')) throw Error('URL is incorrect');
            done();
          })
          .catch(done);
      });

      it('should create agreement', done => {
        AgreementCRUD.createAgreement(nightmare, done, agreement);
      });

      it(`should search for and find agreement: ${agreement.name}`, done => {
        nightmare
          .wait('#input-agreement-search')
          .insert('#input-agreement-search', agreement.name)
          .click('[data-test-search-and-sort-submit]')
          .wait(1000) // If another agreement was open wait for the new one to be open before the next operation.
          .wait('#agreementInfo')
          .evaluate(expectedValues => {
            const node = document.querySelector('[data-test-agreement-name]');
            if (!node || !node.innerText) throw Error('No agreement name node found.');

            const name = node.innerText;
            if (name !== expectedValues.name) {
              throw Error(`Name of found agreement is incorrect. Expected "${expectedValues.name}" and got "${name}" `);
            }
          }, agreement)
          .then(done)
          .catch(done);
      });

      it('should add a new Tag', done => {
        nightmare
          .wait('#clickable-show-tags')
          .click('#clickable-show-tags')
          .wait('#input-tag-input')
          .type('#input-tag-input', testTag)
          .click('#input-tag-input')
          .wait(2222)
          .type('#input-tag-input', '\u000d')
          .wait((tagValue) => {
            return Array.from(
              document.querySelectorAll('div[class*="valueChipValue"]')
            ).findIndex(e => e.textContent === tagValue) >= 0;
          }, testTag)
          .then(() => {
            nightmare
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should have the badge count equal to 1', done => {
        nightmare
          .wait('#clickable-show-tags')
          .wait(() => {
            return Array.from(
              document.querySelectorAll('span[class*="label"]')
            ).findIndex(e => e.textContent === '1') >= 0;
          })
          .then(() => {
            nightmare
              .then(done)
              .catch(done);
          })
          .catch(done);
      });
    });
  });
};
