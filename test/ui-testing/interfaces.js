/* global describe, it, before, after, Nightmare */

const generateNumber = () => Math.round(Math.random() * 100000);

const interfaceName = `Interface ${generateNumber()}`;
const agreementName = `Interface Agreement #${generateNumber()}`;
const org = {
  name: `Org #${generateNumber()}`,
  role: 'Content Provider',
  code: `Code #${generateNumber()}`,
  status: 'Active'
};
const row = 0;
const uri = `http://qwerty${generateNumber()}.com`;
const username = `username #${generateNumber()}`;
const password = `password #${generateNumber()}`;
const notes = `Hello world ${generateNumber()}`;

module.exports.test = (uiTestCtx) => {
  const orgName = org.name;
  const orgCode = org.code;
  const orgStatus = org.status;

  describe(`ui-agreements: set orgs with interfaces: "${orgName}`, function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);
    nightmare.options.width = 1300;

    this.timeout(Number(config.test_timeout));

    describe('open Orgs > create orgs > create interfaces > create agreement', () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it('should open organizations app', done => {
        helpers.clickApp(nightmare, done, 'organizations');
      });

      it('should add interface', done => {
        console.log(`\tCreating ${interfaceName}`);

        nightmare
          .wait('#organizations-module-display')
          .wait('#clickable-neworganization')
          .click('#clickable-neworganization')
          .waitUntilNetworkIdle(1000)
          .wait('#accordion-toggle-button-interfacesSection')
          .click('#accordion-toggle-button-interfacesSection')
          .wait('[data-test-plugin-find-record-button]')
          .click('[data-test-plugin-find-record-button]')
          .wait('[data-test-find-records-modal]')
          .wait('a[href="/organizations/interface/add"]')
          .click('a[href="/organizations/interface/add"]')
          .wait('input[name="name"]')
          .insert('input[name="name"]', interfaceName)
          .wait('input[name="uri"]')
          .insert('input[name="uri"]', uri)
          .wait('input[name="username"]')
          .insert('input[name="username"]', username)
          .wait('input[name="password"]')
          .insert('input[name="password"]', password)
          .wait('textarea[name="notes"]')
          .insert('textarea[name="notes"]', notes)
          .wait('button[type="submit"]')
          .click('button[type="submit"]')
          .wait(2000)
          .wait('[class*=paneHeader] button')
          .click('[class*=paneHeader] button')
          .then(done)
          .catch(done);
      });

      it('should create Org', done => {
        console.log(`\tCreating ${orgName}`);
        nightmare
          .wait('input[name="name"]')
          .insert('input[name="name"]', orgName)
          .wait('input[name="code"]')
          .insert('input[name="code"]', orgCode)
          .wait('select[name="status"]')
          .type('select[name="status"]', orgStatus)
          .wait('#accordion-toggle-button-interfacesSection')
          .click('#accordion-toggle-button-interfacesSection')
          .wait('[data-test-plugin-find-record-button]')
          .click('[data-test-plugin-find-record-button]')
          .waitUntilNetworkIdle(2000)
          .wait('[data-test-find-records-modal] input[type="search"]')
          .type('[data-test-find-records-modal] input[type="search"]', interfaceName)
          .wait('[data-test-find-records-modal] button[type="submit"]')
          .click('[data-test-find-records-modal] button[type="submit"]')
          .waitUntilNetworkIdle(2000)
          .wait('[aria-rowindex="2"] input[type="checkbox"]')
          .click('[aria-rowindex="2"] input[type="checkbox"]')
          .click('[data-test-find-records-modal-save]')
          .wait('#interface-list[aria-rowcount="2"]')
          .click('#clickable-create-organization')
          .then(done)
          .catch(done);
      });

      it('should open agreements app', done => {
        helpers.clickApp(nightmare, done, 'agreements');
      });

      it('should navigate to create agreements page', done => {
        console.log(`\tCreating ${agreementName}`);

        nightmare
          .wait('#agreements-module-display')
          .click('#clickable-nav-agreements')
          .wait('#clickable-new-agreement')
          .click('#clickable-new-agreement')
          .waitUntilNetworkIdle(2000)
          .wait('#edit-agreement-name')
          .insert('#edit-agreement-name', agreementName)
          .click('#edit-agreement-start-date')
          .type('#edit-agreement-start-date', '\u000d') // "Enter" selects current date
          .insert('#edit-agreement-end-date', '2019-01-31')
          .insert('#edit-agreement-cancellation-deadline', '2019-01-15')
          .type('#edit-agreement-status', 'draft')
          .then(done)
          .catch(done);
      });


      it('should add org', done => {
        nightmare
          .click('#add-org-btn')
          .evaluate((r) => {
            if (!document.querySelector(`#orgs-nameOrg-${r}-search-button`)) {
              throw Error('Expected organization picker button to exist.');
            }

            if (!document.querySelector(`#orgs-role-${r}`)) {
              throw Error('Expected role dropdown to exist.');
            }
          }, row)
          .then(done)
          .catch(done);
      });

      it('should select org', done => {
        nightmare
          .click(`#orgs-nameOrg-${row}-search-button`)
          .wait('#input-organization-search')
          .type('#input-organization-search', orgName)
          .wait('[data-test-search-and-sort-submit]')
          .click('[data-test-search-and-sort-submit]')
          .waitUntilNetworkIdle(1000)
          .evaluate((name) => {
            const nameElements = [...document.querySelectorAll('div[role="gridcell"]')];
            const organization = nameElements.find(e => e.textContent === name);
            if (!organization) throw new Error(`Could not find the organization ${name}`);
            organization.click();
          }, orgName)
          .waitUntilNetworkIdle(1000)
          .then(done)
          .catch(done);
      });

      it(`should assign role: ${org.role}`, done => {
        nightmare
          .wait(`#orgs-role-${row}`)
          .type(`#orgs-role-${row}`, org.role)
          .evaluate((r, o) => {
            const roleElement = document.querySelector(`#orgs-role-${r}`);
            const role = roleElement.selectedOptions[0].textContent;
            if (role !== o.role) {
              throw Error(`Expected role to be ${o.role} but is ${role}`);
            }
          }, row, org)
          .then(done)
          .catch(done);
      });

      it('should create Agreement', done => {
        nightmare
          .click('#clickable-create-agreement')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      it(`should find "${org.name}" in Organizations list with role ${org.role}`, done => {
        nightmare
          .evaluate((_org, name) => {
            const rows = [...document.querySelectorAll('[data-test-organization-card]')].map(e => e.textContent);
            const _row = rows.find(r => r.indexOf(name) >= 0);
            if (!_row) {
              throw Error(`Could not find row with an org named ${name}`);
            }
            if (row.indexOf(_org.role) < 0) {
              throw Error(`Expected row for "${name}" to contain role ${_org.role}.`);
            }
          }, org, orgName)
          .then(done)
          .catch(done);
      });

      it(`should find "${interfaceName}" in interface list`, done => {
        nightmare
          .evaluate(_interfaceName => {
            const interfaceElements = [...document.querySelectorAll('#organizations div[role="gridcell"]')];
            const interfaceFound = interfaceElements.find(e => e.textContent === _interfaceName);
            if (!interfaceFound) {
              throw Error(`Could not find row with an interface named ${_interfaceName}`);
            }
          }, interfaceName)
          .then(done)
          .catch(done);
      });

      it(`should find username "${username}"`, done => {
        nightmare
          .evaluate(_username => {
            const usernameElements = [...document.querySelectorAll('#organizations div[role="gridcell"]')];
            const usernameFound = usernameElements.find(e => e.textContent === _username);
            if (!usernameFound) {
              throw Error(`Could not find row with username ${_username}`);
            }
          }, username)
          .then(done)
          .catch(done);
      });

      it(`should find password "${password}"`, done => {
        nightmare
          .evaluate(_password => {
            const passwordElements = [...document.querySelectorAll('#organizations div[role="gridcell"]')];
            const passwordFound = passwordElements.find(e => e.textContent === _password);
            if (!passwordFound) {
              throw Error(`Could not find row with password ${_password}`);
            }
          }, password)
          .then(done)
          .catch(done);
      });

      it(`should find uri "${uri}"`, done => {
        nightmare
          .evaluate(_uri => {
            const uriElements = [...document.querySelectorAll('#organizations span a')];
            const uriFound = uriElements.find(e => e.attributes.href.nodeValue === _uri);
            if (!uriFound) {
              throw Error(`Could not find row with uri ${_uri}`);
            }
          }, uri)
          .then(done)
          .catch(done);
      });

      it(`should find notes "${notes}"`, done => {
        nightmare
          .evaluate(_notes => {
            const notesElements = [...document.querySelectorAll('#organizations div[role="gridcell"]')];
            const notesFound = notesElements.find(e => e.textContent === _notes);
            if (!notesFound) {
              throw Error(`Could not find row with notes ${_notes}`);
            }
          }, notes)
          .then(done)
          .catch(done);
      });

      it('should navigate to Edit Agreement page', done => {
        nightmare
          .wait('#clickable-edit-agreement')
          .click('#clickable-edit-agreement')
          .waitUntilNetworkIdle(2000)
          .then(done)
          .catch(done);
      });

      it(`should find "${org.name}" in Organizations list with role ${org.role}`, done => {
        nightmare
          .evaluate((_org, _orgName) => {
            const rows = [...document.querySelectorAll('[data-test-organizations-org]')].map(e => e.textContent);
            const _row = rows.find(r => r.indexOf(_orgName) >= 0);
            if (!_row) {
              throw Error(`Could not find row with an org named ${_orgName}`);
            }
            if (_row.indexOf(_org.role) < 0) {
              throw Error(`Expected row for "${_orgName}" to contain role ${_org.role}.`);
            }
          }, org, orgName)
          .then(done)
          .catch(done);
      });
    });
  });
};
