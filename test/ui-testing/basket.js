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
      .wait(`#list-agreements [aria-rowindex="${index + 1}"] a`)
      .click(`#list-agreements [aria-rowindex="${index + 1}"] a`)
      .waitUntilNetworkIdle(2000)
      .wait('[data-test-basket-add-button][data-test-add-title-to-basket]')
      .click('[data-test-basket-add-button][data-test-add-title-to-basket]')
      .evaluate((resourceIndex, CONSTANTS) => {
        const selectedResourceNode = document.querySelector(`#list-agreements [aria-rowindex="${resourceIndex + 1}"] a`);
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
      .wait('section#eresources')
      .evaluate(() => {
        const header = document.querySelector('section#eresources [class*=header] button');
        if (!header) throw Error('Could not find Eresources accordion header');

        return header.getAttribute('aria-expanded');
      })
      .then((accordionExpanded) => {
        let chain = nightmare;
        if (accordionExpanded === 'false') {
          chain = chain
            .click('section#eresources [class*=header] button')
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
          if (!line) throw Error(`Could not find agreement line for ${resource.name}`);
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
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    const number = Math.round(Math.random() * 100000);
    const values = {
      search: 's',
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
          .wait('#app-list-item-clickable-agreements-module')
          .click('#app-list-item-clickable-agreements-module')
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
            .wait('#accordion-toggle-button-agreementFormLines')
            .click('#accordion-toggle-button-agreementFormLines')

            // Ensure two agreement lines (0 and 1) has been auto-added for the basket item
            .wait('#agreement-form-lines [data-test-ag-line-number="1"]')

            .insert('#edit-agreement-name', values.agreementName)
            .insert('#edit-agreement-start-date', values.agreementStartDate)
            .type('#edit-agreement-status', values.agreementStatus)
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
            .wait('#select-agreement-for-basket')
            .wait(5000) // Wait for _all_ the agreements to come back
            .click('#select-agreement-for-basket')
            .insert('#sl-container-select-agreement-for-basket input', agreement.name)
            .wait(250)
            .click('#sl-container-select-agreement-for-basket li')
            .wait(250)
            .click('[data-test-basket-add-to-agreement]')

            .wait('#form-agreement')
            .wait('#accordion-toggle-button-agreementFormLines')
            .click('#accordion-toggle-button-agreementFormLines')

            .wait(() => {
              const resources = document.querySelectorAll('#agreement-form-lines [data-test-ag-line-number]');
              return resources.length === 3;
            })
            .click('#clickable-updateagreement')
            .wait('#agreementInfo')
            .waitUntilNetworkIdle(2000) // Wait for the update list of agreement lines to fetch/render
            .then(done)
            .catch(done);
        });

        shouldHaveCorrectAgreementLines(nightmare, [0, 1, 2]);
      });
    });
  });
};
