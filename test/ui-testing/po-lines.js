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

    let poLine = {};
    const basket = [];

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

      it('should link a PO line', done => {
        nightmare
          .wait('[data-test-ag-line-number="0"] #find-record-trigger')
          .click('[data-test-ag-line-number="0"] #find-record-trigger')
          .waitUntilNetworkIdle(2000)
          .wait('#list-plugin-find-records [class*=mclScrollable] [aria-rowindex="2"]')
          .evaluate(() => {
            const row = document.querySelector('#list-plugin-find-records [class*=mclScrollable] [aria-rowindex="2"]');
            return {
              poLineNumber: row.children[0].textContent,
              title: row.children[1].textContent,
            };
          })
          .then(selectedPOLine => {
            poLine = { ...selectedPOLine };

            nightmare
              .click('#list-plugin-find-records [class*=mclScrollable] [aria-rowindex="2"]')
              .wait('#clickable-unlink-poline-0')
              .evaluate(_selectedPOLine => {
                const header = document.querySelector('#edit-poline-card-0 [data-test-card-header-start]').innerText;
                const title = document.querySelector('[data-test-poline-title]').innerText;

                if (header.indexOf(_selectedPOLine.poLineNumber) < 0) {
                  throw Error(`Expected to find PO Line Number of ${_selectedPOLine.poLineNumber} in card header.`);
                }

                if (title !== _selectedPOLine.title) {
                  throw Error(`Expected to find PO Line Title of "${_selectedPOLine.title}"`);
                }
              }, selectedPOLine)
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
          .wait('#accordion-toggle-button-lines')
          .click('#accordion-toggle-button-lines')
          .wait('#agreement-lines a[data-test-po-line]')
          .evaluate(_poLine => {
            const poLineLink = document.querySelector('#agreement-lines a[data-test-po-line]');
            if (!poLineLink) {
              throw Error('Expected to find <a data-test-po-line> tag.');
            }

            if (poLineLink.textContent !== _poLine.poLineNumber) {
              throw Error(`Expected link to show PO Line Number of "${_poLine.poLineNumber}" and found "${poLineLink.textContent}".`);
            }
          }, poLine)
          .then(done)
          .catch(done);
      });
    });
  });
};
