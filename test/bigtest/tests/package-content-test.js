import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import BasketInteractor from '../interactors/basket';
import AgreementFormInteractor from '../interactors/agreement-form';
import AgreementViewInteractor from '../interactors/agreement-view';
import EresourceViewInteractor from '../interactors/eresource-view';

const PKG = {
  name: 'access_start_access_end_tests Package'
};

const currentResource = {
  pti: { titleInstance: { id: '1234', name: 'Accounts of chemical research' } },
  accessStart: () => faker.date.recent().toISOString(),
  accessEnd: () => faker.date.future().toISOString()
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
  const basket = new BasketInteractor();
  const agreementForm = new AgreementFormInteractor();
  const agreementView = new AgreementViewInteractor();
  const eresourceView = new EresourceViewInteractor();

  let eresource;

  beforeEach(async function () {
    eresource = this.server.create('eresource', { name: PKG.name, class: 'org.olf.kb.Pkg', pcis: [droppedResource, currentResource, futureResource] });
  });

  describe('visiting the eresource pane', () => {
    beforeEach(async function () {
      this.visit(`/erm/eresources/${eresource.id}`);
    });

    it('should render expected package', () => {
      expect(eresourceView.headline).to.equal(PKG.name);
    });

    it('should render the expected current eresource', () => {
      expect(eresourceView.packageContent.eresourceName(0)).to.equal(currentResource.pti.titleInstance.name);
    });

    describe('clicking the future eresource tab', () => {
      beforeEach(async function () {
        await eresourceView.packageContent.clickFuture();
      });

      it('should render the expected future resource', () => {
        expect(eresourceView.packageContent.eresourceName(0)).to.equal(futureResource.pti.titleInstance.name);
      });
    });

    describe('clicking the dropped eresource tab', () => {
      beforeEach(async function () {
        await eresourceView.packageContent.clickDropped();
      });

      it('should render the expected dropped resource', () => {
        expect(eresourceView.packageContent.eresourceName(0)).to.equal(droppedResource.pti.titleInstance.name);
      });
    });

    describe('Add eresource to basket and create agreement', () => {
      beforeEach(async function () {
        await eresourceView.clickAddToBasket();
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
            await agreementView.linesSection.clickLinesAccordion();
          });

          it('should render the expected current eresource', () => {
            expect(agreementView.linesSection.coveredEresourcesList.eresourceName(0)).to.equal(currentResource.pti.titleInstance.name);
          });

          it('should find enabled export button', () => {
            expect(agreementView.linesSection.coveredEresourcesList.isExportBtnDisabled).to.be.false;
          });
        });

        describe('clicking future eresource', () => {
          beforeEach(async function () {
            await agreementView.linesSection.clickLinesAccordion();
            await agreementView.linesSection.coveredEresourcesList.clickFuture();
          });

          it('should render the expected future eresource', () => {
            expect(agreementView.linesSection.coveredEresourcesList.eresourceName(0)).to.equal(futureResource.pti.titleInstance.name);
          });

          it('should find disabled export button', () => {
            expect(agreementView.linesSection.coveredEresourcesList.isExportBtnDisabled).to.be.true;
          });
        });

        describe('clicking dropped eresource', () => {
          beforeEach(async function () {
            await agreementView.linesSection.clickLinesAccordion();
            await agreementView.linesSection.coveredEresourcesList.clickDropped();
          });

          it('should render the expected dropped eresource', () => {
            expect(agreementView.linesSection.coveredEresourcesList.eresourceName(0)).to.equal(droppedResource.pti.titleInstance.name);
          });

          it('should find disabled export button', () => {
            expect(agreementView.linesSection.coveredEresourcesList.isExportBtnDisabled).to.be.true;
          });
        });
      });
    });
  });
});
