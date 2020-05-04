import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { mountWithContext } from '../helpers/mountWithContext';

import { PCIFormInfo, PCIFormCoverage } from '../../../src/components/EResourceSections';
import TestForm from './TestForm';

import { pci } from './resources';
import PCIEditPaneInteractor from '../interactors/pci-edit';
import EmbargoInteractor from '../interactors/embargo';

chai.use(spies);
const { expect } = chai;

describe('PCI edit form', () => {
  const embargoInteractor = new EmbargoInteractor();
  const pciEditPaneInteractor = new PCIEditPaneInteractor();

  describe('PCI information', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm initialValues={pci}>
          <PCIFormInfo />
        </TestForm>
      );
    });

    it('renders the pci name', () => {
      expect(pciEditPaneInteractor.pciName).to.equal(pci.name);
    });

    it('renders the expected access from date', () => {
      expect(pciEditPaneInteractor.accessFrom).to.equal('01/01/2014');
    });

    it('renders the expected access until date', () => {
      expect(pciEditPaneInteractor.accessUntil).to.equal('01/01/2015');
    });
  });

  describe('PCI information', () => {
    beforeEach(async () => {
      await mountWithContext(
        <TestForm initialValues={pci}>
          <PCIFormCoverage
            id="pci-form-coverage"
            values={pci}
          />
        </TestForm>
      );
    });

    it('renders the coverage accordion', () => {
      expect(pciEditPaneInteractor.isCoverageAccordionPresent).to.be.true;
    });

    it('renders the embargo', () => {
      expect(embargoInteractor.exists).to.be.true;
    });

    it('renders the embargo moving wall start', () => {
      expect(embargoInteractor.movingWallStartExists).to.be.true;
    });

    it('correctly renders the embargo start length', () => {
      expect(embargoInteractor.startLength).to.have.string(pci.embargo.movingWallStart.length);
    });

    it('correctly renders the embargo start unit', () => {
      expect(embargoInteractor.startUnit).to.have.string(pci.embargo.movingWallStart.unit);
    });

    it('renders the embargo moving wall end', () => {
      expect(embargoInteractor.movingWallEndExists).to.be.true;
    });

    it('correctly renders the embargo end length', () => {
      expect(embargoInteractor.endLength).to.have.string(pci.embargo.movingWallEnd.length);
    });

    it('correctly renders the embargo end unit', () => {
      expect(embargoInteractor.endUnit).to.have.string(pci.embargo.movingWallEnd.unit);
    });

    it('correctly renders the coverage start date', () => {
      expect(pciEditPaneInteractor.coverageCards(0).startDate).to.equal('01/01/1963');
    });

    it('correctly renders the coverage end date', () => {
      expect(pciEditPaneInteractor.coverageCards(0).endDate).to.equal('01/01/1965');
    });

    it('correctly renders the coverage start volume', () => {
      expect(pciEditPaneInteractor.coverageCards(0).startVolume).to.equal(pci.coverage[0].startVolume);
    });

    it('correctly renders the coverage end volume', () => {
      expect(pciEditPaneInteractor.coverageCards(0).endVolume).to.equal(pci.coverage[0].endVolume);
    });

    it('correctly renders the coverage start issue', () => {
      expect(pciEditPaneInteractor.coverageCards(0).startIssue).to.equal(pci.coverage[0].startIssue);
    });

    it('correctly renders the coverage end issue', () => {
      expect(pciEditPaneInteractor.coverageCards(0).endIssue).to.equal(pci.coverage[0].endIssue);
    });

    it('correctly renders the add coverage button', () => {
      expect(pciEditPaneInteractor.isAddButtonPresent).to.be.true;
    });

    describe('clicking the add coverage button', () => {
      beforeEach(async () => {
        await pciEditPaneInteractor.clickAddButton();
      });

      it('renders a new coverage card', () => {
        expect(pciEditPaneInteractor.coverageCount).to.equal(2);
      });
    });
  });
});
