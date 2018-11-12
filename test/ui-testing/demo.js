/* global Nightmare, describe, it, before, after */

module.exports.test = (uiTestCtx) => {
  describe('Module test: ui-agreements:', function test() {
    const { config, helpers: { login, logout } } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));

    describe('Login > navigate to app > verify tabs work > logout', () => {
      before((done) => {
        login(nightmare, config, done);
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it('should open app and see selected Dashboard tab', (done) => {
        nightmare
          .wait('#clickable-agreements-module')
          .click('#clickable-agreements-module')
          .wait('#agreements-module-display')
          .wait('nav #dashboard')
          .evaluate(() => document.querySelector('nav #dashboard').className)
          .then(className => {
            if (!className.includes('primary')) throw Error('Dashboard tab is not selected');
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
    });
  });
};
