import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { mountWithContext } from '@folio/stripes-components/tests/helpers';
import DuplicateAgreementModal from '../../../src/components/DuplicateAgreementModal';
import DuplicateAgreementModalInteractor from '../interactors/duplicate-agreement-modal';
import translations from '../../../translations/ui-agreements/en';

chai.use(spies);
const { expect, spy } = chai;
const interactor = new DuplicateAgreementModalInteractor();

const checkBoxes = {
  'selectAll': 0,
  'agreementInfo': 1,
  'internalContacts': 2,
  'agreementLines': 3,
  'linkedLicenses': 4,
  'externalLicenses': 5,
  'organizations': 6,
  'supplementaryInformation': 7,
  'usageData': 8
};

const onClone = spy();
const onClose = spy();

describe('DuplicateAgreementModal', () => {
  describe('Select all properties', () => {
    const expectedPayLoad = {
      'agreementInfo': true,
      'agreementLines': true,
      'externalLicenses': true,
      'internalContacts': true,
      'linkedLicenses': true,
      'organizations': true,
      'supplementaryInformation': true,
      'usageData': true
    };

    beforeEach(async () => {
      await mountWithContext(
        <DuplicateAgreementModal onClone={onClone} onClose={onClose} />,
        [{ translations, prefix: 'ui-agreements' }]
      );
      await interactor.checkBoxList(checkBoxes.selectAll).click();
      await interactor.clickSaveAndClose();
    });

    it('onClone callback should be called', () => {
      expect(onClone).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onClone).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Select internalContacts and supplementaryInformation properties', () => {
    const expectedPayLoad = {
      'internalContacts': true,
      'supplementaryInformation': true,
    };

    beforeEach(async () => {
      await mountWithContext(
        <DuplicateAgreementModal onClone={onClone} onClose={onClose} />,
        [{ translations, prefix: 'ui-agreements' }]
      );
      await interactor.checkBoxList(checkBoxes.internalContacts).click();
      await interactor.checkBoxList(checkBoxes.supplementaryInformation).click();
      await interactor.clickSaveAndClose();
    });

    it('onClone callback should be called', () => {
      expect(onClone).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onClone).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Check and uncheck supplementaryInformation checkbox', () => {
    const expectedPayLoad = {
      'internalContacts': true,
    };

    beforeEach(async () => {
      await mountWithContext(
        <DuplicateAgreementModal onClone={onClone} onClose={onClose} />,
        [{ translations, prefix: 'ui-agreements' }]
      );
      await interactor.checkBoxList(checkBoxes.internalContacts).click();
      await interactor.checkBoxList(checkBoxes.supplementaryInformation).click();
      await interactor.checkBoxList(checkBoxes.supplementaryInformation).click();
      await interactor.clickSaveAndClose();
    });

    it('onClone callback should be called', () => {
      expect(onClone).to.have.been.called();
    });

    it('renders expected payload', () => {
      expect(onClone).to.have.been.called.with(expectedPayLoad);
    });
  });

  describe('Close the modal by clicking the X button', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DuplicateAgreementModal onClone={onClone} onClose={onClose} />,
        [{ translations, prefix: 'ui-agreements' }]
      );
      await interactor.clickClose();
    });

    it('onClose callback should be called', () => {
      expect(onClose).to.have.been.called();
    });
  });

  describe('Close the modal by clicking the cancel button', () => {
    beforeEach(async () => {
      await mountWithContext(
        <DuplicateAgreementModal onClone={onClone} onClose={onClose} />,
        [{ translations, prefix: 'ui-agreements' }]
      );
      await interactor.clickCancelButton();
    });

    it('onClose callback should be called', () => {
      expect(onClose).to.have.been.called();
    });
  });
});
