import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageContentInteractor from '../interactors/package-content';
import BasketInteractor from '../interactors/basket';
import AgreementFormInteractor from '../interactors/agreement-form';
import AgreementViewInteractor from '../interactors/agreement-view';

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
  const packagecontent = new PackageContentInteractor();
  const basket = new BasketInteractor();
  const agreementform = new AgreementFormInteractor();
  const agreementview = new AgreementViewInteractor();

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
        expect(packagecontent.headline).to.equal(PKG.name);
      });

      it('should render the expected current eresource', () => {
        expect(packagecontent.eresourceName).to.equal(currentResource.pti.titleInstance.name);
      });

      describe('clicking the future eresource tab', () => {
        beforeEach(async function () {
          await packagecontent.clickFuture();
        });

        it('should render the expected future resource', () => {
          expect(packagecontent.eresourceName).to.equal(futureResource.pti.titleInstance.name);
        });
      });

      describe('clicking the dropped eresource tab', () => {
        beforeEach(async function () {
          await packagecontent.clickDropped();
        });

        it('should render the expected dropped resource', () => {
          expect(packagecontent.eresourceName).to.equal(droppedResource.pti.titleInstance.name);
        });
      });

      describe('Add eresource to basket and create agreement', () => {
        beforeEach(async function () {
          await basket.addToBasketButtion();
          await basket.clickOpenBasket();
          await basket.clickCreateNewAgreement();
          await agreementform.fillName('testAgreement');
          await agreementform.selectStatus('Draft');
          await agreementform.processDate('2020-04-01');
          await agreementform.createAgreement();
          await agreementview.whenLoaded();
        });

        describe('should open agreement view pane', () => {
          describe('clicking current eresource', () => {
            beforeEach(async function () {
              await agreementview.clickLinesAccordion();
            });

            it('should render the expected current eresource', () => {
              expect(packagecontent.eresourceName).to.equal(currentResource.pti.titleInstance.name);
            });
          });

          describe('clicking future eresource', () => {
            beforeEach(async function () {
              await agreementview.clickLinesAccordion();
              await packagecontent.clickFuture();
            });

            it('should render the expected future eresource', () => {
              expect(packagecontent.eresourceName).to.equal(futureResource.pti.titleInstance.name);
            });
          });

          describe('clicking dropped eresource', () => {
            beforeEach(async function () {
              await agreementview.clickLinesAccordion();
              await packagecontent.clickDropped();
            });

            it('should render the expected dropped eresource', () => {
              expect(packagecontent.eresourceName).to.equal(droppedResource.pti.titleInstance.name);
            });
          });
        });
      });
    });
  });
});
