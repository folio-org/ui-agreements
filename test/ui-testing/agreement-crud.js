/* global Nightmare, describe, it, before, after */

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-agreements:', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > open agreements > create, view, edit agreement > logout', () => {
      const number = Math.round(Math.random() * 1000);
      const values = {
        name: `Fledgling Agreement #${number}`,
        description: `This agreement of count #${number} is still in its initial stages.`,
        renewalPriority: 'For Review',
        isPerpetual: 'Yes',
      };

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

      it(`should create an agreement: ${values.name}`, done => {
        nightmare
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
    });
  });
};
