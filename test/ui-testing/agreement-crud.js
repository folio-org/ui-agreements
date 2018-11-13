/* global Nightmare, describe, it, before, after */

const generateAgreementValues = () => {
  const number = Math.round(Math.random() * 1000);
  return {
    name: `Fledgling Agreement #${number}`,
    description: `This agreement of count #${number} is still in its initial stages.`,
    renewalPriority: 'For Review',
    isPerpetual: 'Yes',

    editedName: `Edited Agreement #${number}`,
    editedRenewalPriority: 'Definitely Renew',
    editedStatus: 'In Negotiation',
  };
};

const createAgreement = (nightmare, config, defaultValues) => {
  const values = defaultValues || generateAgreementValues();

  it(`should create an agreement: ${values.name}`, done => {
    nightmare
      .wait('#clickable-agreements-module')
      .click('#clickable-agreements-module')
      .wait('#agreements-module-display')
      .click('nav #agreements')
      .wait('#clickable-newagreement')
      .click('#clickable-newagreement')
      .wait('#edit-agreement-name')

      .insert('#edit-agreement-name', values.name)
      .insert('#edit-agreement-description', values.description)

      .click('#edit-agreement-start-date')
      .type('#edit-agreement-start-date', '\u000d') // "Enter" selects current date

      .insert('#edit-agreement-end-date', '2019-01-31')
      .insert('#edit-agreement-cancellation-deadline', '2019-01-15')

      .type('#edit-agreement-agreement-status', 'draft')
      .type('#edit-agreement-renewal-priority', 'for')
      .type('#edit-agreement-is-perpetual', 'yes')

      .click('#clickable-createagreement')
      .wait('#agreementInfo')
      .evaluate(expectedValues => {
        const foundName = document.querySelector('[data-test-agreement-name]').innerText;
        if (foundName !== expectedValues.name) {
          throw Error(`Name of agreement is incorrect. Expected "${expectedValues.name}" and got "${foundName}" `);
        }

        const foundDescription = document.querySelector('[data-test-agreement-description]').innerText;
        if (foundDescription !== expectedValues.description) {
          throw Error(`Description of agreement is incorrect. Expected "${expectedValues.description}" and got "${foundDescription}" `);
        }

        const foundRenewalPriority = document.querySelector('[data-test-agreement-renewalPriority]').innerText;
        if (foundRenewalPriority !== expectedValues.renewalPriority) {
          throw Error(`RenewalPriority of agreement is incorrect. Expected "${expectedValues.renewalPriority}" and got "${foundRenewalPriority}" `);
        }

        const foundIsPerpetual = document.querySelector('[data-test-agreement-isPerpetual]').innerText;
        if (foundIsPerpetual !== expectedValues.isPerpetual) {
          throw Error(`IsPerpetual of agreement is incorrect. Expected "${expectedValues.isPerpetual}" and got "${foundIsPerpetual}" `);
        }
      }, values)
      .then(done)
      .catch(done);
  });

  return values;
};

module.exports.createAgreement = createAgreement;

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-agreements: basic agreement crud', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    const values = generateAgreementValues();

    this.timeout(Number(config.test_timeout));

    describe('Login > open agreements > create, view, edit agreement > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should open app and navigate to Agreements', done => {
        nightmare
          .wait('#clickable-agreements-module')
          .click('#clickable-agreements-module')
          .wait('#agreements-module-display')
          .click('nav #agreements')
          .wait(1000)
          .evaluate(() => document.location.pathname)
          .then(pathName => {
            if (!pathName.includes('/erm/agreements')) throw Error('URL is incorrect');
            done();
          })
          .catch(done);
      });

      createAgreement(nightmare, config, values);

      it(`should search for and find agreement: ${values.name}`, done => {
        nightmare
          .wait('#input-agreement-search')
          .insert('#input-agreement-search', values.name)
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
          }, values)
          .then(done)
          .catch(done);
      });

      it(`should edit agreement to: ${values.editedName}`, done => {
        nightmare
          .click('[class*=paneHeader] [class*=dropdown] button')
          .wait('#clickable-edit-agreement')
          .click('#clickable-edit-agreement')
          .wait('#agreementFormInfo')
          .insert('#edit-agreement-name', '')
          .insert('#edit-agreement-name', values.editedName)

          .insert('#edit-agreement-start-date', '')
          .insert('#edit-agreement-start-date', '2019-10-31')
          .insert('#edit-agreement-end-date', '')
          .insert('#edit-agreement-end-date', '2019-10-31')
          .insert('#edit-agreement-cancellation-deadline', '')
          .insert('#edit-agreement-cancellation-deadline', '2019-10-15')

          .type('#edit-agreement-agreement-status', values.editedStatus)
          .type('#edit-agreement-renewal-priority', values.editedRenewalPriority)
          .click('#clickable-updateagreement')
          .wait(1000) // Wait for the POST/reloading to trigger since #agreementInfo may be up for some ms first.
          .wait('#agreementInfo')
          .evaluate(expectedValues => {
            const name = document.querySelector('[data-test-agreement-name]').innerText;
            if (name !== expectedValues.editedName) {
              throw Error(`Name of found agreement is incorrect. Expected "${expectedValues.editedName}" and got "${name}" `);
            }

            const status = document.querySelector('[data-test-agreement-status]').innerText;
            if (status !== expectedValues.editedStatus) {
              throw Error(`Status of agreement is incorrect. Expected "${expectedValues.editedStatus}" and got "${status}" `);
            }

            const renewalPriority = document.querySelector('[data-test-agreement-renewalPriority]').innerText;
            if (renewalPriority !== expectedValues.editedRenewalPriority) {
              throw Error(`Renewal Priority of agreement is incorrect. Expected "${expectedValues.editedRenewalPriority}" and got "${renewalPriority}" `);
            }
          }, values)
          .then(done)
          .catch(done);
      });
    });
  });
};
