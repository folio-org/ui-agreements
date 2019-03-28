/* global describe, it, before, after, Nightmare */

module.exports.test = (uiTestCtx) => {
  describe('ui-agreements: tab navigation', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > navigate to app > verify tabs work > logout', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open Agreements app', done => {
        helpers.clickApp(nightmare, done, 'agreements');
      });

      it('should open app and see selected Agreements tab', (done) => {
        nightmare
          .wait('nav #agreements')
          .evaluate(() => document.querySelector('nav #agreements').className)
          .then(className => {
            if (!className.includes('primary')) throw Error('Dashboard tab is not selected');
            done();
          })
          .catch(done);
      });

      it('should click E-resources tab and see updated URL', (done) => {
        nightmare
          .click('nav #eresources')
          .wait(1000)
          .evaluate(() => document.location.pathname)
          .then(pathName => {
            if (!pathName.includes('/erm/eresources')) throw Error('URL is incorrect');
            done();
          })
          .catch(done);
      });

      it('should click Agreements tab and see updated URL', (done) => {
        nightmare
          .click('nav #agreements')
          .wait(1000)
          .evaluate(() => document.location.pathname)
          .then(pathName => {
            if (!pathName.includes('/erm/agreements')) throw Error('URL is incorrect');
            done();
          })
          .catch(done);
      });
    });
  });
};
