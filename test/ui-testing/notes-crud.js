/* global describe, it, before, after, Nightmare */
const AgreementCRUD = require('./agreement-crud');

module.exports.test = (uiTestCtx) => {
    const number = Math.round(Math.random() * 100000);
    const testNote = `test${Math.floor(Math.random() * 100000)}`;
    const noteType = `noteType${Math.floor(Math.random() * 100000)}`;
    const agreement = {
        name: `Notes Agreement #${number}`,
    };

    describe('Notes crud', function test() {
        const { config, helpers } = uiTestCtx;
        const nightmare = new Nightmare(config.nightmare);
        nightmare.options.width = 1300; // added this temporarily as MultiSelect doesnt work well with narrow screen sizes

        this.timeout(Number(config.test_timeout));

        describe('Login > Find agreement > Create notes > Logout\n', () => {
            before((done) => {
                helpers.login(nightmare, config, done);
            });

            after((done) => {
                helpers.logout(nightmare, config, done);
            });

            it('should create note type in settings', done => {
                nightmare
                    .wait(config.select.settings)
                    .click(config.select.settings)
                    .wait('#app-list-item-clickable-settings')
                    .wait('a[href="/settings/notes"]')
                    .click('a[href="/settings/notes"]')
                    .wait('a[href="/settings/notes/general"]')
                    .click('a[href="/settings/notes/general"]')
                    .wait('#clickable-add-noteTypes')
                    .click('#clickable-add-noteTypes')
                    .wait('input[name="items[0].name"]')
                    .type('input[name="items[0].name"]', noteType)
                    .wait('#clickable-save-noteTypes-0')
                    .click('#clickable-save-noteTypes-0')
                    .wait(222)
                    .then(done)
                    .catch(done);
            });

            it('should open Agreements app', done => {
                helpers.clickApp(nightmare, done, 'agreements');
            });

            it('should confirm correct URL', done => {
                nightmare
                    .evaluate(() => document.location.pathname)
                    .then(pathName => {
                        if (!pathName.includes('/erm/agreements')) throw Error('URL is incorrect');
                        done();
                    })
                    .catch(done);
            });

            it('should create agreement', done => {
                AgreementCRUD.createAgreement(nightmare, done, agreement);
            });

            it('should add a new note', done => {
                nightmare
                    .wait('#accordion-toggle-button-notes-accordion')
                    .wait('[data-test-notes-accordion-new-button]')
                    .click('[data-test-notes-accordion-new-button]')
                    .wait('[data-test-note-types-field]')
                    .type('[data-test-note-types-field]', noteType)
                    .wait('[data-test-note-title-field]')
                    .insert('[data-test-note-title-field]', testNote)
                    .wait('[data-test-save-note]')
                    .click('[data-test-save-note]')
                    .waitUntilNetworkIdle(2000)
                    .then(done)
                    .catch(done);
            });

            it('shoud find created note in notes list', done => {
                nightmare
                    .evaluate(note => {
                        const rows = [...document.querySelectorAll('#notes-list')].map(e => e.textContent);
                        const row = rows.find(r => r.indexOf(note) >= 0);
                        if (!row) {
                            throw Error(`Could not find row with the note ${note}`);
                        }
                    }, testNote)
                    .then(done)
                    .catch(done);
            });
        });
    });
};
