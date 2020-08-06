import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Form } from 'react-final-form';

import { mountWithContext } from '../helpers/mountWithContext';

import { SuppressFromDiscoveryFieldArray } from '../../../src/settings/components';
import SuppressFromDiscoveryInteractor from '../interactors/suppress-from-discovery';

const interactor = new SuppressFromDiscoveryInteractor();
let formValues = {};

describe('Suppress from discovery tests', () => {
  describe('Rendering the "Suppress from discovery" settings component', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={({ handleSubmit, values }) => {
            formValues = values;
            return (
              <form onSubmit={handleSubmit}>
                <SuppressFromDiscoveryFieldArray name="test" />
              </form>
            );
          }}
          subscription={{ values: true }}
        />
      );
    });

    it('renders the description', () => {
      expect(interactor.isDescription).to.be.true;
    });

    describe('agreement line checkbox tests', () => {
      it('renders the agreement line checkbox', () => {
        expect(interactor.isAgreementLine).to.be.true;
      });

      it('agreement line checkbox has the correct name prop', () => {
        expect(interactor.agreementLineFieldName).to.equal('test.agreementLine');
      });

      it('agreementLine checkbox is false', () => {
        expect(formValues.test?.agreementLine).to.equal(false || undefined);
      });

      describe('Clicking the agreement line checkbox', () => {
        beforeEach(async function () {
          await interactor.checkAgreementLine();
        });

        it('agreementLine checkbox is now true', () => {
          expect(formValues.test?.agreementLine).to.equal(true);
        });
      });
    });

    describe('pci checkbox tests', () => {
      it('renders the pci checkbox', () => {
        expect(interactor.isPCI).to.be.true;
      });

      it('pci checkbox has the correct name prop', () => {
        expect(interactor.pciFieldName).to.equal('test.pci');
      });

      it('pci checkbox is false', () => {
        expect(formValues.test?.pci).to.equal(false || undefined);
      });

      describe('Clicking the pci checkbox', () => {
        beforeEach(async function () {
          await interactor.checkPCI();
        });

        it('pci checkbox is now true', () => {
          expect(formValues.test?.pci).to.equal(true);
        });
      });
    });
  });
});
