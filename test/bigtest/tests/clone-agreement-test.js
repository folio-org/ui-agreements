import { beforeEach, describe, it } from '@bigtest/mocha';
import { faker } from '@bigtest/mirage';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import BasketInteractor from '../interactors/basket';
import AgreementFormInteractor from '../interactors/agreement-form';
import AgreementViewInteractor from '../interactors/agreement-view';

const agreementData = {
  id: '1234',
  name: 'cloneable agreement',
  agreementStatus: 'active',
  periods: [{
    startDate: '2019-11-13'
  }]
};

describe.only('Clone Agreement test', () => {
  setupApplication();
  const agreementView = new AgreementViewInteractor();
  let agreement;

  beforeEach(async function () {
    agreement = this.server.create('agreement', agreementData);
  });

  describe('click duplicate job', () => {
    beforeEach(async function () {
      await this.visit(`erm/agreements/${agreement.id}`);
      await agreementView.whenLoaded();
    });

    describe('click duplicate job', () => {
      beforeEach(async function () {
        await agreementView.headerDropdown.click();
        await agreementView.headerDropdownMenu.clickDuplicate();
      });

      it('should render the expected agreement', () => {
        expect(agreementView.isDuplcateModalPresent).to.be.true;
      });
    });
  });
});
