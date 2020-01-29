import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../helpers/mountWithContext';

import { Coverage } from '../../../src/components/Coverage';
import MonographCoverageInteractor from '../interactors/monograph-coverage';
import SerialCoverageInteractor from '../interactors/serial-coverage';

const monographInteractor = new MonographCoverageInteractor();

const serialInteractor = new SerialCoverageInteractor();
const serialInteractorStart = new SerialCoverageInteractor('[data-test-start]');
const serialInteractorEnd = new SerialCoverageInteractor('[data-test-end]');

const monograph = {
  pti: {
    titleInstance: {
      id: '1501',
      name: 'This is a monograph',
      dateMonographPublished: '1996',
      monographVolume: '5',
      monographEdition: '2nd',
      type: {
        value: 'monograph',
        label: 'Monograph'
      },
      subType: {
        value: 'electronic',
        label: 'Electronic'
      }
    }
  }
};

const serial = {
  pti: {
    titleInstance: {
      id: '2612',
      name: 'This is a serial',
      type: { value: 'serial', label: 'Serial' },
      subType: {
        value: 'electronic',
        label: 'Electronic'
      }
    }
  },
  coverage: [{
    startDate: '2001-12-06',
    endDate: '2007-10-05',
    startVolume: '76',
    startIssue: '1',
    endVolume: '79',
    endIssue: '2'
  }]
};

// We also want to test the other two possible shapes for passing this data through to Coverage

const monographCoveredEResource = {
  _object: monograph
};

const serialCoveredEResource = {
  _object: serial,
  coverage: serial.coverage
};

const monographLine = {
  resource: monographCoveredEResource
};

const serialLine = {
  resource: serialCoveredEResource._object,
  coverage: serial.coverage
};

describe('Coverage tests', () => {
  describe('Rendering coverage component for a monograph pci', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Coverage pci={monograph} />
      );
    });

    it('renders the monograph coverage', () => {
      expect(monographInteractor.exists).to.be.true;
    });

    it('correctly renders the date', () => {
      expect(monographInteractor.date).to.have.string(monograph.pti.titleInstance.dateMonographPublished);
    });

    it('correctly renders the edition', () => {
      expect(monographInteractor.edition).to.have.string(monograph.pti.titleInstance.monographEdition);
    });

    it('correctly renders the volume', () => {
      expect(monographInteractor.volume).to.have.string(monograph.pti.titleInstance.monographVolume);
    });
  });

  describe('Rendering coverage component for a monograph coveredEresource', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Coverage coveredEResource={monographCoveredEResource} />
      );
    });

    it('renders the monograph coverage', () => {
      expect(monographInteractor.exists).to.be.true;
    });

    it('correctly renders the date', () => {
      expect(monographInteractor.date).to.have.string(monographCoveredEResource._object.pti.titleInstance.dateMonographPublished);
    });

    it('correctly renders the edition', () => {
      expect(monographInteractor.edition).to.have.string(monographCoveredEResource._object.pti.titleInstance.monographEdition);
    });

    it('correctly renders the volume', () => {
      expect(monographInteractor.volume).to.have.string(monographCoveredEResource._object.pti.titleInstance.monographVolume);
    });
  });

  describe('Rendering coverage component for a monograph line', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Coverage line={monographLine} />
      );
    });

    it('renders the monograph coverage', () => {
      expect(monographInteractor.exists).to.be.true;
    });

    it('correctly renders the date', () => {
      expect(monographInteractor.date).to.have.string(monographLine.resource._object.pti.titleInstance.dateMonographPublished);
    });

    it('correctly renders the edition', () => {
      expect(monographInteractor.edition).to.have.string(monographLine.resource._object.pti.titleInstance.monographEdition);
    });

    it('correctly renders the volume', () => {
      expect(monographInteractor.volume).to.have.string(monographLine.resource._object.pti.titleInstance.monographVolume);
    });
  });

  describe('Rendering coverage component for a serial pci', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Coverage pci={serial} />
      );
    });

    it('renders the serial coverage', () => {
      expect(serialInteractor.exists).to.be.true;
    });
    it('renders the first set of data', () => {
      expect(serialInteractor.first).to.be.true;
    });
    it('renders the last set of data', () => {
      expect(serialInteractor.end).to.be.true;
    });
    it('renders the arrow icon', () => {
      expect(serialInteractor.icon).to.be.true;
    });
    it('renders the correct start date', () => {
      expect(serialInteractorStart.startDate).to.have.string('12/6/2001');
    });
    it('renders the correct end date', () => {
      expect(serialInteractorEnd.endDate).to.have.string('10/5/2007');
    });
    it('renders the correct start issue', () => {
      expect(serialInteractorStart.startIssue).to.have.string(serial.coverage[0].startIssue);
    });
    it('renders the correct end issue', () => {
      expect(serialInteractorEnd.endIssue).to.have.string(serial.coverage[0].endIssue);
    });
    it('renders the correct start volume', () => {
      expect(serialInteractorStart.startVolume).to.have.string(serial.coverage[0].startVolume);
    });
    it('renders the correct end volume', () => {
      expect(serialInteractorEnd.endVolume).to.have.string(serial.coverage[0].endVolume);
    });
  });

  describe('Rendering coverage component for a serial coveredEResource', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Coverage coveredEResource={serialCoveredEResource} />
      );
    });

    it('renders the serial coverage', () => {
      expect(serialInteractor.exists).to.be.true;
    });
    it('renders the first set of data', () => {
      expect(serialInteractor.first).to.be.true;
    });
    it('renders the last set of data', () => {
      expect(serialInteractor.end).to.be.true;
    });
    it('renders the arrow icon', () => {
      expect(serialInteractor.icon).to.be.true;
    });
    it('renders the correct start date', () => {
      expect(serialInteractorStart.startDate).to.have.string('12/6/2001');
    });
    it('renders the correct end date', () => {
      expect(serialInteractorEnd.endDate).to.have.string('10/5/2007');
    });
    it('renders the correct start issue', () => {
      expect(serialInteractorStart.startIssue).to.have.string(serialCoveredEResource.coverage[0].startIssue);
    });
    it('renders the correct end issue', () => {
      expect(serialInteractorEnd.endIssue).to.have.string(serialCoveredEResource.coverage[0].endIssue);
    });
    it('renders the correct start volume', () => {
      expect(serialInteractorStart.startVolume).to.have.string(serialCoveredEResource.coverage[0].startVolume);
    });
    it('renders the correct end volume', () => {
      expect(serialInteractorEnd.endVolume).to.have.string(serialCoveredEResource.coverage[0].endVolume);
    });
  });

  describe('Rendering coverage component for a serial line', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Coverage line={serialLine} />
      );
    });

    it('renders the serial coverage', () => {
      expect(serialInteractor.exists).to.be.true;
    });
    it('renders the first set of data', () => {
      expect(serialInteractor.first).to.be.true;
    });
    it('renders the last set of data', () => {
      expect(serialInteractor.end).to.be.true;
    });
    it('renders the arrow icon', () => {
      expect(serialInteractor.icon).to.be.true;
    });
    it('renders the correct start date', () => {
      expect(serialInteractorStart.startDate).to.have.string('12/6/2001');
    });
    it('renders the correct end date', () => {
      expect(serialInteractorEnd.endDate).to.have.string('10/5/2007');
    });
    it('renders the correct start issue', () => {
      expect(serialInteractorStart.startIssue).to.have.string(serialLine.coverage[0].startIssue);
    });
    it('renders the correct end issue', () => {
      expect(serialInteractorEnd.endIssue).to.have.string(serialLine.coverage[0].endIssue);
    });
    it('renders the correct start volume', () => {
      expect(serialInteractorStart.startVolume).to.have.string(serialLine.coverage[0].startVolume);
    });
    it('renders the correct end volume', () => {
      expect(serialInteractorEnd.endVolume).to.have.string(serialLine.coverage[0].endVolume);
    });
  });
});
