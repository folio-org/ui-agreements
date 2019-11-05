import { beforeEach, describe, it } from '@bigtest/mocha';

import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import AgreementFormInteractor from '../interactors/agreement-form';
import AgreementViewInteractor from '../interactors/agreement-view';

const agreementData = {
  id: '1234',
  name: 'cloneable agreement',
  agreementStatus: { value: 'active' },
  periods: [{
    startDate: '2019-11-13'
  }]
};

describe('Clone Agreement test', () => {
  setupApplication();
  const agreementView = new AgreementViewInteractor();
  const agreementEdit = new AgreementFormInteractor();
  let agreement;

  beforeEach(async function () {
    agreement = this.server.create('agreement', agreementData);
  });

  describe('click duplicate agreement button', () => {
    beforeEach(async function () {
      await this.visit(`erm/agreements/${agreement.id}`);
      await agreementView.whenLoaded();
    });

    describe('slect all properties to duplicate', () => {
      beforeEach(async function () {
        await agreementView.headerDropdown.click();
        await agreementView.headerDropdownMenu.clickDuplicate();
        await agreementView.duplicateAgreementModal.checkBoxList(0).click();
        await agreementView.duplicateAgreementModal.clickSaveAndClose();
        await agreementEdit.whenLoaded();
      });

      it('should render the expected name on the edit page', () => {
        expect(agreementEdit.name).to.equal(agreementData.name);
      });
    });
  });
});
