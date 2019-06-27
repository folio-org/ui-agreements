/* global describe, it, before, after, Nightmare */

const AgreementCRUD = require('./agreement-crud');

const _CONSTANTS = {
  ERESOURCES_NAME_COLUMN: 0,
  ERESOURCES_TYPE_COLUMN: 1,
  LINES_NAME_COLUMN: 0,
  LINES_TYPE_COLUMN: 2,
};

const BASKET = [];

const shouldAddTitleToBasket = (nightmare, index, basket = BASKET) => {
  it(`should add title ${index} to basket`, done => {
    nightmare
      .wait(`#list-eresources [aria-rowindex="${index + 1}"]`)
      .click(`#list-eresources [aria-rowindex="${index + 1}"]`)
      .waitUntilNetworkIdle(2000)
      .wait('[data-test-basket-add-button][data-test-add-title-to-basket]')
      .click('[data-test-basket-add-button][data-test-add-title-to-basket]')
      .evaluate((resourceIndex, CONSTANTS) => {
        const selectedResourceNode = document.querySelector(`#list-eresources [aria-rowindex="${resourceIndex + 1}"]`);
        const name = selectedResourceNode.children[CONSTANTS.ERESOURCES_NAME_COLUMN].innerText;
        const type = selectedResourceNode.children[CONSTANTS.ERESOURCES_TYPE_COLUMN].innerText;

        const removeButton = document.querySelector('[data-test-basket-remove-button]');
        const addedItem = {
          id: removeButton.getAttribute('data-test-entitlement-option-id'),
          name,
          type,
        };

        return addedItem;
      }, index, _CONSTANTS)
      .then(addedItem => {
        basket.push(addedItem);
        done();
      })
      .catch(done);
  });
};

module.exports.shouldAddTitleToBasket = shouldAddTitleToBasket;

const shouldHaveCorrectAgreementLines = (nightmare, basketIndices = [], basket = BASKET) => {
  it(`should see ${basketIndices.length} lines with correct resources`, done => {
    nightmare
      .wait('#accordion-toggle-button-lines')
      .evaluate(() => {
        const header = document.querySelector('#accordion-toggle-button-lines');
        if (!header) throw Error('Could not find Eresources accordion header');

        return header.getAttribute('aria-expanded');
      })
      .then((accordionExpanded) => {
        let chain = nightmare;
        if (accordionExpanded === 'false') {
          chain = chain
            .click('#accordion-toggle-button-lines')
            .wait('#agreement-lines [class*=mclScrollable] [aria-rowindex]');
        }

        return chain.evaluate((CONSTANTS, indices) => {
          const lines = [...document.querySelectorAll('#agreement-lines [class*=mclScrollable] [aria-rowindex]')];

          if (lines.length !== indices.length) throw Error(`Expected to find ${indices.length} agreement line and found ${lines.length}`);

          return lines.map(node => ({
            id: node.children[CONSTANTS.LINES_NAME_COLUMN].children[0].getAttribute('data-test-resource-id'),
            name: node.children[CONSTANTS.LINES_NAME_COLUMN].textContent,
            type: node.children[CONSTANTS.LINES_TYPE_COLUMN].textContent,
          }));
        }, _CONSTANTS, basketIndices);
      })
      .then(lines => {
        basketIndices.forEach(index => {
          const resource = basket[index];
          const line = lines.find(l => l.id === resource.id);
          if (!line) throw Error(`Could not find agreement line for ${resource.name} (${resource.id})`);
          if (line.id !== resource.id) throw Error(`Expected Line #0 ID (${line.id}) to be ${resource.id}`);
          if (line.name !== resource.name) throw Error(`Expected Line #0 Name (${line.name}) to be ${resource.name}`);
          if (line.type !== resource.type) throw Error(`Expected Line #0 Type (${line.type}) to be ${resource.type}`);
        });

        done();
      })
      .catch(done);
  });
};
module.exports.shouldHaveCorrectAgreementLines = shouldHaveCorrectAgreementLines;

module.exports.test = (uiTestCtx) => {
  describe('ui-agreements: basic basket functionality', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    const number = Math.round(Math.random() * 100000);
    const values = {
      search: 's',
      agreementName: `Basketforged Agreement #${number}`,
      agreementStartDate: '2019-01-31',
      agreementRenewalPriority: 'Definitely renew',
      agreementStatus: 'In negotiation',
    };

    this.timeout(Number(config.test_timeout));

    describe('open eresources > add eresources to basket', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Agreements app', done => {
        helpers.clickApp(nightmare, done, 'agreements');
      });

      it('should open eresources', done => {
        nightmare
          .waitUntilNetworkIdle(1000)
          .click('#clickable-nav-eresources')
          .waitUntilNetworkIdle(1000)
          .then(done)
          .catch(done);
      });

      it(`should search for "${values.search}"`, done => {
        nightmare
          .wait('#input-eresource-search')
          .insert('#input-eresource-search', values.search)
          .click('#clickable-search-eresources')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      shouldAddTitleToBasket(nightmare, 1);

      shouldAddTitleToBasket(nightmare, 2);

      shouldAddTitleToBasket(nightmare, 3);

      it('should display a View Basket button with three items', done => {
        nightmare
          .evaluate(() => {
            const basketButton = document.querySelector('[data-test-open-basket-button]');
            if (!basketButton) throw Error('Could not find "View Basket" button');

            const basketSize = basketButton.getAttribute('data-test-basket-size');
            if (basketSize !== '3') throw Error(`Expected 3 items in basket button and found "${basketSize}"`);
          })
          .then(done)
          .catch(done);
      });

      it('should open basket and see three items', done => {
        nightmare
          .click('[data-test-open-basket-button]')
          .wait('#basket-contents')
          .evaluate(() => {
            const basketContents = document.querySelectorAll('#basket-contents [class*=mclScrollable] [aria-rowindex]');
            const basketSize = basketContents.length;
            if (basketSize !== 3) throw Error(`Expected 3 items in the basket and found ${basketSize}`);
          })
          .then(done)
          .catch(done);
      });

      describe('create agreement via Basket from first and third items in basket', () => {
        it(`should create a new agreement: ${values.agreementName}`, done => {
          nightmare
            .click('#basket-contents [class*=mclScrollable] [aria-rowindex="3"] input[type=checkbox]')
            .click('[data-test-basket-create-agreement]')
            .wait('#accordion-toggle-button-formLines')
            .click('#accordion-toggle-button-formLines')

            // Ensure two agreement lines (0 and 1) has been auto-added for the basket item
            .wait('#agreement-form-lines [data-test-ag-line-number="1"]')

            .insert('#edit-agreement-name', values.agreementName)
            .insert('#edit-agreement-start-date', values.agreementStartDate)
            .type('#edit-agreement-status', values.agreementStatus)
            .click('#clickable-create-agreement')
            .wait('[data-test-agreement-info]')
            .waitUntilNetworkIdle(2000)
            .then(done)
            .catch(done);
        });

        it('should see correct agreement fields', done => {
          nightmare
            .wait('[data-test-agreement-info]')
            .evaluate(expectedValues => {
              const foundName = document.querySelector('[data-test-agreement-name]').innerText;
              if (foundName !== expectedValues.agreementName) {
                throw Error(`Name of agreement is incorrect. Expected "${expectedValues.agreementName}" and got "${foundName}" `);
              }

              const foundStatus = document.querySelector('[data-test-agreement-status]').innerText;
              if (foundStatus !== expectedValues.agreementStatus) {
                throw Error(`Status of agreement is incorrect. Expected "${expectedValues.agreementStatus}" and got "${foundStatus}" `);
              }
            }, values)
            .then(done)
            .catch(done);
        });

        shouldHaveCorrectAgreementLines(nightmare, [0, 2]);
      });

      describe('create agreement via New Agreement with second item > add first and third items via Basket', () => {
        const agreement = AgreementCRUD.generateAgreementValues();

        it(`should create agreement: ${agreement.name}`, done => {
          AgreementCRUD.createAgreement(nightmare, done, agreement, BASKET[1].id);
        });

        it(`should add first and third items to agreement: ${agreement.name}`, done => {
          nightmare
            .click('[data-test-open-basket-button]')

            // Unselect the second item in the basket
            .wait('#basket-contents [class*=mclScrollable] [aria-rowindex="3"] input[type=checkbox]')
            .click('#basket-contents [class*=mclScrollable] [aria-rowindex="3"] input[type=checkbox]')

            .wait('#select-agreement-for-basket')
            .waitUntilNetworkIdle(2000) // Wait for _all_ the agreements to come back
            .click('#select-agreement-for-basket')
            .insert('#sl-container-select-agreement-for-basket input', agreement.name)
            .wait(250)
            .click('#sl-container-select-agreement-for-basket li')
            .wait(250)
            .click('[data-test-basket-add-to-agreement]')

            .wait('#form-agreement')
            .wait('#accordion-toggle-button-formLines')
            .click('#accordion-toggle-button-formLines')

            .wait(() => {
              const resources = document.querySelectorAll('#agreement-form-lines [data-test-ag-line-number]');
              return resources.length === 3;
            })
            .click('#clickable-update-agreement')
            .wait('[data-test-agreement-info]')
            .waitUntilNetworkIdle(2000) // Wait for the update list of agreement lines to fetch/render
            .then(done)
            .catch(done);
        });

        shouldHaveCorrectAgreementLines(nightmare, [0, 1, 2]);
      });
    });
  });
};
