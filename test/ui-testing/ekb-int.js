/* global describe, it, before, after, Nightmare */

const getCreateAgreementUrl = ({ authority, referenceId }) => (
  `/erm/agreements?layer=create&authority=${authority}&referenceId=${referenceId}`
);

const getEHoldingsUrl = ({ authority, referenceId }) =>  {
  if (authority === 'EKB-PACKAGE') return `/eholdings/packages/${referenceId}`;
  if (authority === 'EKB-TITLE') return `/eholdings/resources/${referenceId}`;
}

module.exports.test = (uiTestCtx) => {
  describe('ui-agreements: eholdings integration', function test() {
    const { config, helpers } = uiTestCtx;
    const nightmare = new Nightmare(config.nightmare);

    console.log('\n    These tests require the eHoldings backend module (mod-kb-ebsco-java).');
    console.log('    Ensure it is installed and running before expecting these tests to pass.')

    const resources = [{
      authority: 'EKB-PACKAGE',
      referenceId: '301-3707'
    }, {
      authority: 'EKB-TITLE',
      referenceId: '120853-2337939-11517622'
    }]

    const runValues = resources.map(resource => ({
      name: `EHoldings Agreement #${Math.round(Math.random() * 100000)}`,
      createAgreementUrl: `${config.url}${getCreateAgreementUrl(resource)}`,
      eholdingsUrl: getEHoldingsUrl(resource),
      authority: resource.authority,
      referenceId: resource.referenceId,
    }));

    this.timeout(Number(config.test_timeout));

    describe(`create new agreements with authority/referenceId > check agreement lines`, () => {
      before((done) => {
        helpers.login(nightmare, config, done);
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      runValues.forEach(values => {
        describe(`authority: ${values.authority}, referenceId: ${values.referenceId}`, () => {
          it('should open create agreement page with authority/reference query string', done => {
            nightmare
              .goto(values.createAgreementUrl)
              .wait('#edit-agreement-name')
              .waitUntilNetworkIdle(1000)

              .insert('#edit-agreement-name', values.name)
              .click('#edit-agreement-start-date')
              .type('#edit-agreement-start-date', '\u000d') // "Enter" selects current date
              .type('#edit-agreement-status', 'active')
              .then(done)
              .catch(done);
          });

          it('should have auto-added agreement line with information', done => {
            nightmare
              .click('#accordion-toggle-button-agreementFormLines')
              .evaluate(expected => {
                if (!document.querySelector('[data-test-ag-line-number]')) {
                  throw Error(`Failed to find expected agreement line for "${expected.referenceId}".`)
                }

                if (!document.querySelector('[data-test-ag-line-name]').textContent) {
                  throw Error('Expected to find a resource name.');
                }

                if (!document.querySelector(`[data-test-ag-line-name] a[href="${expected.eholdingsUrl}"]`)) {
                  throw Error(`Expected to find name with URL to "${expected.eholdingsUrl}".`);
                }

                if (!document.querySelector('[data-test-ag-line-type]').textContent) {
                  throw Error('Expected to find a resource type.');
                }

                if (!document.querySelector('[data-test-ag-line-titles]').textContent) {
                  throw Error('Expected to find a count of titles.');
                }

                if (!document.querySelector('[data-test-ag-line-provider]').textContent) {
                  throw Error('Expected to find a resource provider.');
                }
              }, values)
              .then(done)
              .catch(done);
          });

          it(`should create agreement ${values.name}`, done => {
            nightmare
              .click('#clickable-createagreement')
              .wait('#agreementInfo')
              .then(done)
              .catch(done);
          });

          it('should check agreement lines listing', done => {
              nightmare
              .wait('#accordion-toggle-button-eresourcesAgreementLines')
              .click('#accordion-toggle-button-eresourcesAgreementLines')
              .evaluate(expected => {
                const cells = [...document.querySelectorAll('#agreement-lines [aria-rowindex="2"] [role="gridcell"]')];

                cells.forEach((cell, i) => {
                  if (i > 3) return;
                  if (!cell.textContent) {
                    throw Error(`Expected to find text in agreement line cell #${i}.`);
                  }
                });

                if (!cells[0].querySelector(`a[href="${expected.eholdingsUrl}"]`)) {
                  throw Error(`Expected to find link to "${expected.eholdingsUrl}" in agreement line.`);
                }
              }, values)
              .then(done)
              .catch(done);
          });
        });
      });
    });
  });
};
