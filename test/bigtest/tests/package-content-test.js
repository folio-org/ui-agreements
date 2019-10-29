import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageContentInteractor from '../interactors/package-content';

const PKG = {
  name: 'access_start_access_end_tests Package'
};

const testData = [
  { pti: { titleInstance: { id: '1234', name: 'testInstance1' } }, accessStart: () => faker.date.recent().toISOString() },
  { pti: { titleInstance: { id: '234', name: 'testInstance2' } }, accessStart: () => faker.date.future().toISOString() },
  { pti: { titleInstance: { id: '734', name: 'testInstance3' } }, accessEnd: () => faker.date.recent().toISOString() },
];

describe('PackageContentCRUD', () => {
  setupApplication();
  const packagecontent = new PackageContentInteractor();
  let eresource;

  beforeEach(async function () {
    eresource = this.server.create('eresource', { name: PKG.name, testData });
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
        expect(packagecontent.eresourceName).to.equal(testData[0].pti.titleInstance.name);
      });

      describe('clicking the future eresource tab', () => {
        beforeEach(async function () {
          await packagecontent.clickFuture();
        });

        it('should render the expected future resource', () => {
          expect(packagecontent.eresourceName).to.equal(testData[1].pti.titleInstance.name);
        });
      });

      describe('clicking the dropped eresource tab', () => {
        beforeEach(async function () {
          await packagecontent.clickDropped();
        });

        it('should render the expected dropped resource', () => {
          expect(packagecontent.eresourceName).to.equal(testData[2].pti.titleInstance.name);
        });
      });

      describe('Add eresource to basket and create agreement', () => {
        beforeEach(async function () {
          await packagecontent.addToBasketButtion();
          await packagecontent.clickOpenBasket();
          await packagecontent.clickCreateNewAgreement();
          await packagecontent.fillName('testAgreement');
          await packagecontent.selectStatus('Draft');
          await packagecontent.processDate('2020-04-01');
          await packagecontent.createAgreement();
          await packagecontent.whenLoaded();
        });

        describe('should open agreement view pane', () => {
          describe('clicking current eresource', () => {
            beforeEach(async function () {
              await packagecontent.clickLinesAccordion();
            });

            it('should render the expected current eresource', () => {
              expect(packagecontent.eresourceName).to.equal(testData[0].pti.titleInstance.name);
            });
          });

          describe('clicking future eresource', () => {
            beforeEach(async function () {
              await packagecontent.clickLinesAccordion();
              await packagecontent.clickFuture();
            });

            it('should render the expected future eresource', () => {
              expect(packagecontent.eresourceName).to.equal(testData[1].pti.titleInstance.name);
            });
          });

          describe('clicking dropped eresource', () => {
            beforeEach(async function () {
              await packagecontent.clickLinesAccordion();
              await packagecontent.clickDropped();
            });

            it('should render the expected dropped eresource', () => {
              expect(packagecontent.eresourceName).to.equal(testData[2].pti.titleInstance.name);
            });
          });
        });
      });
    });
  });
});