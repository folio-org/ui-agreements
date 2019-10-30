import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageContentInteractor from '../interactors/package-content';
import BasketInteractor from '../interactors/basket';
import AgreementFormInteractor from '../interactors/agreement-form';
import AgreementViewInteractor from '../interactors/agreement-view';
import EresourceViewInteractor from '../interactors/eresource-view';

const PKG = {
  name: 'access_start_access_end_tests Package'
};

const currentResource = {
  'pti': { titleInstance: { id: '1234', name: 'Accounts of chemical research' } },
  'accessStart': () => faker.date.recent().toISOString(),
};

const futureResource = {
  pti: { titleInstance: { id: '234', name: 'Analytical chemistry' } },
  accessStart: () => faker.date.future().toISOString()
};

const droppedResource = {
  pti: { titleInstance: { id: '734', name: 'Bioconjugate chemistry' } },
  accessEnd: () => faker.date.recent().toISOString()
};

describe('Package Content Filters', () => {
  setupApplication();
  const packageContent = new PackageContentInteractor();
  const basket = new BasketInteractor();
  const agreementForm = new AgreementFormInteractor();
  const agreementView = new AgreementViewInteractor();
  const eresourceView = new EresourceViewInteractor();

  let eresource;

  beforeEach(async function () {
    eresource = this.server.create('eresource', { name: PKG.name, class: 'org.olf.kb.Pkg', pcis: [droppedResource, currentResource, futureResource] });
  });

  describe('packagecontent tests', () => {
    beforeEach(async function () {
      this.visit(`/erm/eresources/${eresource.id}`);
    });

    describe('visiting the eresource pane', () => {
      it('should render expected package', () => {
        expect(eresourceView.headline).to.equal(PKG.name);
      });

      it('should render the expected current eresource', () => {
        expect(packageContent.eresourceName).to.equal(currentResource.pti.titleInstance.name);
      });

      describe('clicking the future eresource tab', () => {
        beforeEach(async function () {
          await packageContent.clickFuture();
        });

        it('should render the expected future resource', () => {
          expect(packageContent.eresourceName).to.equal(futureResource.pti.titleInstance.name);
        });
      });

      describe('clicking the dropped eresource tab', () => {
        beforeEach(async function () {
          await packageContent.clickDropped();
        });

        it('should render the expected dropped resource', () => {
          expect(packageContent.eresourceName).to.equal(droppedResource.pti.titleInstance.name);
        });
      });

      describe('Add eresource to basket and create agreement', () => {
        beforeEach(async function () {
          await basket.addToBasketButtion();
          await basket.clickOpenBasket();
          await basket.clickCreateNewAgreement();
          await agreementForm.fillName('testAgreement');
          await agreementForm.selectStatus('Draft');
          await agreementForm.fillStartDate('2020-04-01');
          await agreementForm.createAgreement();
          await agreementView.whenLoaded();
        });

        describe('open agreement view pane', () => {
          describe('clicking the lines accordion', () => {
            beforeEach(async function () {
              await agreementView.clickLinesAccordion();
            });

            it('should render the expected current eresource', () => {
              expect(packageContent.eresourceName).to.equal(currentResource.pti.titleInstance.name);
            });
          });

          describe('clicking future eresource', () => {
            beforeEach(async function () {
              await agreementView.clickLinesAccordion();
              await agreementView.coveredEresourcesList.clickFuture();
            });

            it('should render the expected future eresource', () => {
              expect(packageContent.eresourceName).to.equal(futureResource.pti.titleInstance.name);
            });
          });

          describe('clicking dropped eresource', () => {
            beforeEach(async function () {
              await agreementView.clickLinesAccordion();
              await agreementView.coveredEresourcesList.clickDropped();
            });

            it('should render the expected dropped eresource', () => {
              expect(packageContent.eresourceName).to.equal(droppedResource.pti.titleInstance.name);
            });
          });
        });
      });
    });
  });
});
