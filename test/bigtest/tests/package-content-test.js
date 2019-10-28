import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import PackageContentInteractor from '../interactors/package-content';

const PKG = {
  name: 'access_start_access_end_tests Package',
  filters: {
    all: {
      name: 'all',
      expectedContent: [
        { name: 'Afghanistan' },
        { name: 'Archaeological and Environmental Forensic Science' },
        { name: 'Archives of Natural History' },
        { name: 'Bethlehem University Journal' },
      ]
    },
    current: {
      name: 'current',
      expectedContent: [
        { name: 'Archaeological and Environmental Forensic Science' },
      ]
    },
    dropped: {
      name: 'dropped',
      expectedContent: [
        { name: 'Afghanistan' },
        { name: 'Archives of Natural History' },
      ]
    },
    future: {
      name: 'future',
      expectedContent: [
        { name: 'Bethlehem University Journal' },
      ]
    },
  },
};

describe('PackageContentCRUD', () => {
  setupApplication();
  const packagecontent = new PackageContentInteractor();

  describe('packagecontent tests', () => {
    const testData = [
      { pti: { titleInstance: { id: '1234', name: 'testInstance1' } }, accessStart: () => faker.date.recent().toISOString() },
      { pti: { titleInstance: { id: '234', name: 'testInstance2' } }, accessStart: () => faker.date.future().toISOString() },
      { pti: { titleInstance: { id: '734', name: 'testInstance3' } }, accessEnd: () => faker.date.recent().toISOString() },
    ];

    beforeEach(async function () {
      const eresource = this.server.create('eresource', { name: PKG.name, testData });
      this.visit(`/erm/eresources/${eresource.id}`);
    });

    describe('returns the list of eresources of type package', () => {
      it('renders expected package', () => {
        expect(packagecontent.headline).to.equal(PKG.name);
      });

      it('renders the expected eresource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[0].pti.titleInstance.name);
      });
    });

    describe('future eresource', () => {

      beforeEach(async function () {
        await packagecontent.clickFuture();
      });

      it('renders expected future resource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[1].pti.titleInstance.name);
      });
    });

    describe('dropped eresource', () => {

      beforeEach(async function () {
        await packagecontent.clickDropped();
      });

      it('renders expected dropped resource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[2].pti.titleInstance.name);
      });
    });

    describe('View basket and create agreement', () => {

      beforeEach(async function () {
        await packagecontent.addToBasketButtion();
        await packagecontent.clickOpenBasket();
        await packagecontent.clickCreateNewAgreement();
        await packagecontent.fillName('adi');
        await packagecontent.selectStatus('Draft');
        await packagecontent.processDate('2020-04-01');
        await packagecontent.createAgreement();
      });

      it('renders expected dropped resource', () => {
        expect(packagecontent.eresourceName).to.equal(testData[2].pti.titleInstance.name);
      });
    });
  });
});
