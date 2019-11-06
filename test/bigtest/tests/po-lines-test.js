import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import { getCurrentPOLine } from '../helpers/findPOLineModule';

import BasketInteractor from '../interactors/basket';
import AgreementFormInteractor from '../interactors/agreement-form';
import AgreementViewInteractor from '../interactors/agreement-view';
import EresourcesInteractor from '../interactors/eresources';
import EresourceViewInteractor from '../interactors/eresource-view';

const eresourcesToCreate = [
  { name: 'Package of Apples', class: 'org.olf.kb.Pkg' },
  { name: 'Package of Bananas', class: 'org.olf.kb.Pkg' }
];

describe.only('PO Lines', () => {
  setupApplication();
  const basketInteractor = new BasketInteractor();
  const agreementForm = new AgreementFormInteractor();
  const agreementView = new AgreementViewInteractor();
  const eresourcesInteractor = new EresourcesInteractor();
  const eresourceInteractor = new EresourceViewInteractor();

  let eresources = [];

  beforeEach(async function () {
    eresources = await eresourcesToCreate.map(eresource => this.server.create('eresource', eresource));
  });

  describe('loading e-resources list', () => {
    beforeEach(async function () {
      this.visit('/erm/eresources');
    });

    it('should list the created eresources', () => {
      expect(eresourcesInteractor.list.rowCount).to.equal(eresourcesToCreate.length);
    });

    describe('begin creating new agreement with two agreement lines', () => {
      beforeEach(async function () {
        await eresourcesInteractor.list.rows(0).click();
        await eresourceInteractor.clickAddToBasket();

        await eresourcesInteractor.list.rows(1).click();
        await eresourceInteractor.clickAddToBasket();

        await basketInteractor.clickOpenBasket();
        await basketInteractor.clickCreateNewAgreement();
      });

      it('should have two agreement lines', () => {
        expect(agreementForm.linesSection.lineCount).to.equal(2);
      });

      it('should have correct eresource names for each agreement line', () => {
        const names = eresources.map(e => e.name);
        expect(names).to.include(agreementForm.linesSection.lines(0).name);
        expect(names).to.include(agreementForm.linesSection.lines(1).name);
      });

      describe('add PO line to first agreement line', () => {
        beforeEach(async function() {

        });
      });
    });

    // describe('visiting the eresource pane', () => {
    //   it('should render expected package', () => {
    //     expect(eresourceView.headline).to.equal(PKG.name);
    //   });

    //   it('should render the expected current eresource', () => {
    //     expect(eresourceView.packageContent.eresourceName).to.equal(currentResource.pti.titleInstance.name);
    //   });

    //   describe('clicking the future eresource tab', () => {
    //     beforeEach(async function () {
    //       await eresourceView.packageContent.clickFuture();
    //     });

    //     it('should render the expected future resource', () => {
    //       expect(eresourceView.packageContent.eresourceName).to.equal(futureResource.pti.titleInstance.name);
    //     });
    //   });

    //   describe('clicking the dropped eresource tab', () => {
    //     beforeEach(async function () {
    //       await eresourceView.packageContent.clickDropped();
    //     });

    //     it('should render the expected dropped resource', () => {
    //       expect(eresourceView.packageContent.eresourceName).to.equal(droppedResource.pti.titleInstance.name);
    //     });
    //   });

    //   describe('Add eresource to basket and create agreement', () => {
    //     beforeEach(async function () {
    //       await basket.addToBasketButtion();
    //       await basket.clickOpenBasket();
    //       await basket.clickCreateNewAgreement();
    //       await agreementForm.fillName('testAgreement');
    //       await agreementForm.selectStatus('Draft');
    //       await agreementForm.fillStartDate('2020-04-01');
    //       await agreementForm.createAgreement();
    //       await agreementView.whenLoaded();
    //     });

    //     describe('open agreement view pane', () => {
    //       describe('clicking the lines accordion', () => {
    //         beforeEach(async function () {
    //           await agreementView.lines.clickLinesAccordion();
    //         });

    //         it('should render the expected current eresource', () => {
    //           expect(agreementView.lines.coveredEresourcesList.eresourceName).to.equal(currentResource.pti.titleInstance.name);
    //         });
    //       });

    //       describe('clicking future eresource', () => {
    //         beforeEach(async function () {
    //           await agreementView.lines.clickLinesAccordion();
    //           await agreementView.lines.coveredEresourcesList.clickFuture();
    //         });

    //         it('should render the expected future eresource', () => {
    //           expect(agreementView.lines.coveredEresourcesList.eresourceName).to.equal(futureResource.pti.titleInstance.name);
    //         });
    //       });

    //       describe('clicking dropped eresource', () => {
    //         beforeEach(async function () {
    //           await agreementView.lines.clickLinesAccordion();
    //           await agreementView.lines.coveredEresourcesList.clickDropped();
    //         });

    //         it('should render the expected dropped eresource', () => {
    //           expect(agreementView.lines.coveredEresourcesList.eresourceName).to.equal(droppedResource.pti.titleInstance.name);
    //         });
    //       });
    //     });
    //   });
    // });
  });
});
