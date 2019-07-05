/* global describe, it, before, after, Nightmare */

const AgreementCRUD = require('./agreement-crud');
const Basket = require('./basket');
const Utils = require('./utils');

module.exports.test = (uiTestCtx) => {
  describe('ui-agreements: PO Lines / Orders integration', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    const values = {
      name: `PO Lines Agreement #${Math.round(Math.random() * 100000)}`,
    };

    const basket = [];
    const poLine = {};

    this.timeout(Number(config.test_timeout));

    describe('create agreement w/ agreement lines > link PO line > unlink PO line > link other PO line', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Agreements app', done => {
        helpers.clickApp(nightmare, done, 'agreements');
      });

      Utils.shouldNavToEResources(nightmare);
      Basket.shouldAddTitleToBasket(nightmare, 1, basket);

      it(`should create agreement: ${values.name}`, function _(done) {
        AgreementCRUD.createAgreement(nightmare, done, values, basket[0].id);
      });

      Basket.shouldHaveCorrectAgreementLines(nightmare, [0], basket);

      it('should edit agreement', done => {
        nightmare
          .wait('#clickable-edit-agreement')
          .click('#clickable-edit-agreement')
          .wait('#accordion-toggle-button-formLines')
          .click('#accordion-toggle-button-formLines')
          .then(done)
          .catch(done);
      });

      it('should link a PO line', done => {
        nightmare
          .wait('[data-test-ag-line-number="0"] [data-test-plugin-find-po-line-button]')
          .click('[data-test-ag-line-number="0"] [data-test-plugin-find-po-line-button]')
          .wait('#list-plugin-find-po-line [aria-rowindex="2"]')
          .click('#list-plugin-find-po-line [aria-rowindex="2"]')
          .evaluate(() => {
            const row = document.querySelector('#list-plugin-find-po-line [aria-rowindex="2"] a');
            return {
              poLineNumber: row.children[1].textContent,
              title: row.children[2].textContent,
            };
          })
          .then(_selectedPOLine => {
            poLine = { ..._selectedPOLine };

            nightmare
              .click('[data-test-find-po-line-modal-save]')
              .wait('#clickable-unlink-poline-0')
              .evaluate(selectedPOLine => {
                const header = document.querySelector('#edit-poline-card-0 [data-test-card-header-start]').innerText;
                const title = document.querySelector('[data-test-poline-title]').innerText;

                if (header.indexOf(selectedPOLine.poLineNumber) < 0) {
                  throw Error(`Expected to find PO Line Number of ${selectedPOLine.poLineNumber} in card header.`);
                }

                if (title !== selectedPOLine.title) {
                  throw Error(`Expected to find PO Line Title of "${selectedPOLine.title}"`);
                }
              }, _selectedPOLine)
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should save agreement', done => {
        nightmare
          .click('#clickable-update-agreement')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      it('should see PO Line in agreement lines table', done => {
        nightmare
          .click('#accordion-toggle-button-lines')
          .
      });
    });
  });
};
