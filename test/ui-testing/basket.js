/* global Nightmare, describe, it, before, after */

// import { createAgreement } from './agreement-crud';

const _CONSTANTS = {
  ERESOURCES_NAME_COLUMN: 0,
  ERESOURCES_TYPE_COLUMN: 1,
  LINES_NAME_COLUMN: 0,
  LINES_TYPE_COLUMN: 2,
};

const BASKET = [];

const addTitleToBasket = (nightmare, done, index) => {
  return nightmare
    .wait(`#list-agreements [role=listitem]:nth-of-type(${index}) a`)
    .click(`#list-agreements [role=listitem]:nth-of-type(${index}) a`)
    .wait('[data-test-basket-add-button][data-test-add-title-to-basket]')
    .click('[data-test-basket-add-button][data-test-add-title-to-basket]')
    // .wait('[data-test-basket-remove-button]')
    .evaluate((resourceIndex, CONSTANTS) => {
      const selectedResourceNode = document.querySelector(`#list-agreements [role=listitem]:nth-of-type(${resourceIndex}) a`);
      const name = selectedResourceNode.children[CONSTANTS.ERESOURCES_NAME_COLUMN].innerText;
      const type = selectedResourceNode.children[CONSTANTS.ERESOURCES_TYPE_COLUMN].innerText;

      const removeButtons = [...document.querySelectorAll('[data-test-basket-remove-button]')];
      const addedItems = removeButtons.map(node => ({
        id: node.getAttribute('data-test-entitlement-option-id'),
        name,
        type,
      }));

      return addedItems;
    }, index, _CONSTANTS)
    .then(addedItems => {
      BASKET.push(...addedItems);

      done();
    })
    .catch(done);
};

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

      it('should add first title to the basket', done => {
        addTitleToBasket(nightmare, done, 1);
      });

      it('should add second title to the basket', done => {
        addTitleToBasket(nightmare, done, 2);
      });

      it('should add third title to the basket', done => {
        addTitleToBasket(nightmare, done, 3);
      });

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
            const basketContents = document.querySelectorAll('#basket-contents [role=listitem]');
            const basketSize = basketContents.length;
            if (basketSize !== 3) throw Error(`Expected 3 items in the basket and found ${basketSize}`);
          })
          .then(done)
          .catch(done);
      });

      describe('create agreement from first and third items in basket', () => {
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

        it('should see two agreement lines with correct resources', done => {
          nightmare
            .wait('section#eresources')
            .evaluate((CONSTANTS) => {
              const lines = [...document.querySelectorAll('#agreement-lines [role=listitem]')];

              if (lines.length !== 2) throw Error(`Expected to find 2 agreement line and found ${lines.length}`);

              return lines.map(node => ({
                id: node.children[CONSTANTS.LINES_NAME_COLUMN].children[0].getAttribute('data-test-resource-id'),
                name: node.children[CONSTANTS.LINES_NAME_COLUMN].textContent,
                type: node.children[CONSTANTS.LINES_TYPE_COLUMN].textContent,
              }));
            }, _CONSTANTS)
            .then(lines => {
              const firstTitleLine = lines.find(line => line.id === BASKET[0].id);
              const thirdTitleLine = lines.find(line => line.id === BASKET[2].id);

              if (!firstTitleLine) throw Error(`Could not find agreement line for ${BASKET[0].name}`);
              if (!thirdTitleLine) throw Error(`Could not find agreement line for ${BASKET[2].name}`);

              if (firstTitleLine.id !== BASKET[0].id) throw Error(`Expected Line #0 ID (${firstTitleLine.id}) to be ${BASKET[0].id}`);
              if (thirdTitleLine.id !== BASKET[2].id) throw Error(`Expected Line #1 ID (${thirdTitleLine.id}) to be ${BASKET[2].id}`);
              if (firstTitleLine.name !== BASKET[0].name) throw Error(`Expected Line #0 Name (${firstTitleLine.name}) to be ${BASKET[0].name}`);
              if (thirdTitleLine.name !== BASKET[2].name) throw Error(`Expected Line #1 Name (${thirdTitleLine.name}) to be ${BASKET[2].name}`);
              if (firstTitleLine.type !== BASKET[0].type) throw Error(`Expected Line #0 Type (${firstTitleLine.type}) to be ${BASKET[0].type}`);
              if (thirdTitleLine.type !== BASKET[2].type) throw Error(`Expected Line #1 Type (${thirdTitleLine.type}) to be ${BASKET[2].type}`);

              done();
            })
            .catch(done);
        });
      });
    });
  });
};
