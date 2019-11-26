/* global describe, it, before, after, Nightmare */
const AgreementCRUD = require('./agreement-crud');

module.exports.test = (uiTestCtx) => {
  const number = Math.round(Math.random() * 100000);
  const licenses = [{
    name: `Controlling Warnings License #${number}`,
    note: `This controlling license was automatically created and linked for run ${number}`,
    status: 'Controlling',
    startDate: '2018-07-01',
  }, {
    name: `Future Warnings License #${number}`,
    note: `This future license was automatically created and linked for run ${number}`,
    status: 'Future',
    startDate: '2028-07-01',
  }, {
    name: `Historical Warnings License #${number}`,
    note: `This historical license was automatically created and linked for run ${number}`,
    status: 'Historical',
    startDate: '2008-07-01',
  }];

  const agreement = {
    name: `Linked License Warnings Agreement #${number}`,
  };

  describe('ui-agreements: linked license warnings', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('create agreement > link licenses', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Licenses app', done => {
        helpers.clickApp(nightmare, done, 'licenses');
      });

      // Create licenses and add amendments
      licenses.forEach(l => {
        it(`should create new license: ${l.name}`, done => {
          nightmare
            .wait('#clickable-new-license')
            .click('#clickable-new-license')

            .waitUntilNetworkIdle(2000) // Wait for the default values to be fetched and set.

            .wait('#edit-license-name')
            .insert('#edit-license-name', l.name)
            .insert('#edit-license-start-date', l.startDate)

            .click('#clickable-create-license')

            .waitUntilNetworkIdle(2000)
            .wait('#clickable-expand-all')
            .click('#clickable-expand-all')
            .click('#add-amendment-button')
            .wait('#edit-amendment-name')
            .insert('#edit-amendment-name', 'Current Amendment')
            .click('#clickable-create-amendment')
            .waitUntilNetworkIdle(2000)

            .wait('#clickable-expand-all')
            .click('#clickable-expand-all')
            .click('#add-amendment-button')
            .wait('#edit-amendment-name')
            .insert('#edit-amendment-name', 'Rejected Amendment')
            .wait('#edit-amendment-status')
            .type('#edit-amendment-status', 'rejected')
            .click('#clickable-create-amendment')
            .waitUntilNetworkIdle(2000)

            .wait('#clickable-expand-all')
            .click('#clickable-expand-all')
            .click('#add-amendment-button')
            .wait('#edit-amendment-name')
            .insert('#edit-amendment-name', 'Expired Amendment')
            .wait('#edit-amendment-status')
            .type('#edit-amendment-status', 'expired')
            .click('#clickable-create-amendment')
            .waitUntilNetworkIdle(2000)

            .wait('#clickable-expand-all')
            .click('#clickable-expand-all')
            .click('#add-amendment-button')
            .wait('#edit-amendment-name')
            .insert('#edit-amendment-name', 'StartDate Amendment')
            .wait('#edit-amendment-start-date')
            .insert('#edit-amendment-start-date', '2119-11-26')
            .click('#clickable-create-amendment')
            .waitUntilNetworkIdle(2000)

            .wait('#clickable-expand-all')
            .click('#clickable-expand-all')
            .click('#add-amendment-button')
            .wait('#edit-amendment-name')
            .insert('#edit-amendment-name', 'EndDate Amendment')
            .wait('#edit-amendment-end-date')
            .insert('#edit-amendment-end-date', '1919-11-26')
            .click('#clickable-create-amendment')
            .waitUntilNetworkIdle(2000)

            .then(() => nightmare.click('#pane-view-license button[icon=times]'))
            .then(done)
            .catch(done);
        });
      });

      it('should open Agreements app', done => {
        helpers.clickApp(nightmare, done, 'agreements');
      });

      it(`should create agreement: ${agreement.name}`, done => {
        AgreementCRUD.createAgreement(nightmare, done, agreement);
      });

      it('should open edit agreement page and open licenses accordion', done => {
        nightmare
          .wait('#clickable-edit-agreement')
          .click('#clickable-edit-agreement')
          .wait('#formLicenses')
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
            .wait('#plugin-find-license-modal #clickable-search-licenses')
            .click('#plugin-find-license-modal #clickable-search-licenses')
            .wait('#list-licenses[data-total-count="1"]')
            .wait(`#plugin-find-license-modal [role="row"][data-label*="${l.name}"]`)
            .click(`#plugin-find-license-modal [role="row"][data-label*="${l.name}"]`)
            .waitUntilNetworkIdle(2000)

            .insert(`#linkedLicenses-note-${i}`, l.note)
            .then(done)
            .catch(done);
        });
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

      licenses.forEach((l, i) => {
        it(`should set amendment statuses for ${l.name}`, done => {
          nightmare
            .type(`#linkedLicenses-remoteId-${i}-license-card [data-test-amendment="Current Amendment"] select`, 'Current')
            .type(`#linkedLicenses-remoteId-${i}-license-card [data-test-amendment="Rejected Amendment"] select`, 'Current')
            .type(`#linkedLicenses-remoteId-${i}-license-card [data-test-amendment="Expired Amendment"] select`, 'Current')
            .type(`#linkedLicenses-remoteId-${i}-license-card [data-test-amendment="StartDate Amendment"] select`, 'Current')
            .type(`#linkedLicenses-remoteId-${i}-license-card [data-test-amendment="EndDate Amendment"] select`, 'Current')

            .then(done)
            .catch(done);
        });
      });

      it('should save updated agreement', done => {
        nightmare
          .click('#clickable-update-agreement')
          .wait('[data-test-agreement-info]')
          .waitUntilNetworkIdle(2000)
          .wait('#clickable-expand-all')
          .click('#clickable-expand-all')
          .then(done)
          .catch(done);
      });
    });
  });
};
