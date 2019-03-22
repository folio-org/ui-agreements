/* global describe, it, before, after, Nightmare */
const AgreementCRUD = require('./agreement-crud');

let NUMBER_OF_TERMS;

const TERM = {
  name: 'otherRestrictions',
  label: 'Other restrictions',
  value: 'A Few',
  editedValue: 'A Lot',
};

module.exports.test = (uiTestCtx, term = TERM) => {
  const number = Math.round(Math.random() * 100000);
  const licenses = [{
    name: `Controlling License #${number}`,
    note: `This controlling license was automatically created and linked for run ${number}`,
    status: 'Controlling',
    startDate: '2018-07-01',
  }];

  const agreement = {
    name: `Linked License Agreement #${number}`,
  };

  describe('ui-agreements: license terms', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('login > create license > edit terms > create agreement > link license > check term > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should open Licenses module', done => {
        nightmare
          .wait('#app-list-item-clickable-licenses-module')
          .click('#app-list-item-clickable-licenses-module')
          .wait('#licenses-module-display')
          .then(done)
          .catch(done);
      });

      licenses.forEach(l => {
        it(`should create new license: ${l.name}`, done => {
          nightmare
            .wait('#clickable-newlicense')
            .click('#clickable-newlicense')

            .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

            .insert('#edit-license-name', l.name)
            .insert('#edit-license-start-date', l.startDate)

            .click('#accordion-toggle-button-licenseFormTerms')

            /* .click('#clickable-createlicense')
            .wait('#licenseInfo')
            .waitUntilNetworkIdle(500)
            .then(() => nightmare.click('#pane-view-license button[icon=times]')) */
            .then(done)
            .catch(done);
        });

        it('should count the number of terms', done => {
          nightmare
            .evaluate(() => [...document.querySelectorAll('[data-test-term-name]')].length)
            .then(count => {
              NUMBER_OF_TERMS = count;
            })
            .then(done)
            .catch(done);
        });

        it('should add term', done => {
          nightmare
            .click('#add-term-btn')
            .wait(500)
            .evaluate(() => [...document.querySelectorAll('[data-test-term-name]')].length)
            .then(count => {
              if (count !== NUMBER_OF_TERMS + 1) {
                throw Error(`Expected ${NUMBER_OF_TERMS + 1} terms but found ${count}!`);
              }

              NUMBER_OF_TERMS += 1;
            })
            .then(done)
            .catch(done);
        });

        it(`should set term to: ${term.value}`, done => {
          nightmare
            .type(`#edit-term-${NUMBER_OF_TERMS - 1}-name`, term.label)
            .type(`#edit-term-${NUMBER_OF_TERMS - 1}-value`, term.value)
            .then(done)
            .catch(done);
        });

        it('should create license', done => {
          nightmare
            .click('#clickable-createlicense')
            .wait('#licenseInfo')
            .waitUntilNetworkIdle(500)
            .then(() => nightmare.click('#pane-view-license button[icon=times]'))
            .then(done)
            .catch(done);
        });

        it('should find new term in terms list', done => {
          nightmare
            .evaluate((expectedTerm) => {
              const nameElement = document.querySelector(`[data-test-term-label=${expectedTerm.name}]`);
              const valueElement = document.querySelector(`[data-test-term-value=${expectedTerm.name}]`);

              if (!nameElement) {
                throw Error(`Expected to find ${expectedTerm.name} label`);
              }

              if (nameElement.textContent !== expectedTerm.label) {
                throw Error(`Expected to find ${expectedTerm.label}`);
              }

              if (!valueElement) {
                throw Error(`Expected to find ${expectedTerm.name} value`);
              }

              if (valueElement.textContent !== expectedTerm.value) {
                throw Error(`Expected to find ${expectedTerm.value}`);
              }
            }, term)
            .then(done)
            .catch(done);
        });
      });

      it(`should create agreement: ${agreement.name}`, done => {
        AgreementCRUD.createAgreement(nightmare, done, agreement);
      });

      it('should open edit agreement page and open licenses accordion', done => {
        nightmare
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-agreement')
          .click('#clickable-edit-agreement')
          .wait('#agreementFormInfo')
          .click('#accordion-toggle-button-agreementFormLicense')
          .then(done)
          .catch(done);
      });

      licenses.forEach((l, i) => {
        it(`should link license: ${l.name}`, done => {
          nightmare
            .click('#add-license-btn')
            .wait(`#linkedLicenses-remoteId-${i}-find-license-btn`)
            .click(`#linkedLicenses-remoteId-${i}-find-license-btn`)
            .wait('#plugin-find-license-modal')
            .waitUntilNetworkIdle(1000)
            .wait('#plugin-find-license-modal #input-license-search')
            .insert('#plugin-find-license-modal #input-license-search', l.name)
            .wait('#plugin-find-license-modal #pane-filter button[type="submit"]')
            .click('#plugin-find-license-modal #pane-filter button[type="submit"]')
            .wait('#list-plugin-find-license[data-total-count="1"]')
            .wait(`#plugin-find-license-modal [role="row"] a[data-label*="${l.name}"]`)
            .click(`#plugin-find-license-modal [role="row"] a[data-label*="${l.name}"]`)
            .wait(`#linkedLicenses-remoteId-${i}-license-card`)
            .insert(`#linkedLicenses-note-${i}`, l.note)
            .then(done)
            .catch(done);
        });
      });

      it('should fail to save due to license link status being unselected', done => {
        nightmare
          .click('#clickable-updateagreement')
          .evaluate(() => {
            if (!document.querySelector('label[for*="linkedLicenses-status-"] ~ div[role="alert"] [class*="feedbackError"]')) {
              throw Error('Expected to find a license link status error messages because it is undefined and did not');
            }
          })
          .then(done)
          .catch(done);
      });

      it('should set license link statuses', done => {
        licenses.reduce((nightmare2, l, i) => (
          nightmare2.type(`#linkedLicenses-status-${i}`, l.status)
        ), nightmare)
          .evaluate(() => {
            const error = document.querySelector('label[for*="linkedLicenses-status-"] ~ div[role="alert"] [class*="feedbackError"]');
            if (error) {
              throw Error(`Found license link status error message: ${error}`);
            }
          })
          .then(done)
          .catch(done);
      });

      it('should set license link statuses', done => {
        licenses.reduce((nightmare2, l, i) => (
          nightmare2.type(`#linkedLicenses-status-${i}`, l.status)
        ), nightmare)
          .evaluate(() => {
            const error = document.querySelector('label[for*="linkedLicenses-status-"] ~ div[role="alert"] [class*="feedbackError"]');
            if (error) {
              throw Error(`Found license link status error message: ${error}`);
            }
          })
          .then(done)
          .catch(done);
      });

      it('should save updated agreement', done => {
        nightmare
          .click('#clickable-updateagreement')
          .wait('#agreementInfo')
          .waitUntilNetworkIdle(2000)
          .wait('#accordion-toggle-button-licenseInfo')
          .click('#accordion-toggle-button-licenseInfo')
          .then(done)
          .catch(done);
      });

      const controllingLicense = licenses.find(l => l.status === 'Controlling');
      if (controllingLicense) {
        it('should find controlling license', done => {
          nightmare
            .wait('#agreement-controlling-license')
            .evaluate(expected => {
              const controllingLicenseElement = document.querySelector('#agreement-controlling-license');
              if (!controllingLicenseElement) throw Error('Failed to find controlling license element');

              const name = controllingLicenseElement.querySelector('[data-test-license-card-name]').innerText;
              if (name !== expected.name) throw Error(`Expected controlling license name "${expected.name}" and found "${name}".`);
            }, controllingLicense)
            .then(done)
            .catch(done);
        });
      }

      /* it('should open Licenses module', done => {
        nightmare
          .wait('#app-list-item-clickable-licenses-module')
          .click('#app-list-item-clickable-licenses-module')
          .wait('#licenses-module-display')
          .exists('#app-list-dropdown-toggle[aria-expanded="true"]')
          .then(dropdownOpen => {
            if (dropdownOpen) nightmare.click('#app-list-dropdown-toggle');
          })
          .then(done)
          .catch(done);
      });

      it(`should find and open ${licenses[0].name}`, done => {
        nightmare
          .wait('#input-license-search')
          .insert('#input-license-search', licenses[0].name)
          .click('#pane-filter button[type="submit"]')
          .waitUntilNetworkIdle(2000)
          .click('#list-licenses [aria-rowindex="2"] a')
          .wait(licenseName => {
            const nameElement = document.querySelector('[data-test-license-name]');
            if (!nameElement) return false;

            return nameElement.innerText === licenseName;
          }, licenses[0].name)
          .then(done)
          .catch(done);
      });

      it(`should find ${agreement.name} in Linked Agreements section`, done => {
        nightmare
          .wait('#linked-agreements-table')
          .evaluate(agreementName => {
            const nameElement = document.evaluate(
              `//*[@id="linked-agreements-table"]//div[.="${agreementName}"]`,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE
            ).singleNodeValue;

            if (!nameElement) throw Error(`Expected linked agreement node for name ${agreementName}`);
          }, agreement.name)
          .then(done)
          .catch(done);
      }); */
    });
  });
};
