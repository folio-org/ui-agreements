import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { mountWithContext } from '../helpers/mountWithContext';

import Embargo from '../../../src/components/Embargo';
import EmbargoInteractor from '../interactors/embargo';

const embargoInteractor = new EmbargoInteractor();

const embargo = {
  movingWallStart: { length: 3, unit: 'months' },
  movingWallEnd: { length: 90, unit: 'days' },
};

// We also want to test the other possible shapes for passing this data through to Embargo

const noEmbargo = {};

const noMovingWallEnd = {
  movingWallStart: embargo.movingWallStart,
};

const noMovingWallStart = {
  movingWallEnd: embargo.movingWallEnd,
};

describe('Embargo tests', () => {
  describe('Rendering embargo component', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Embargo embargo={embargo} />
      );
    });
    it('renders the embargo', () => {
      expect(embargoInteractor.exists).to.be.true;
    });

    it('renders the embargo moving wall start', () => {
      expect(embargoInteractor.movingWallStartExists).to.be.true;
    });

    it('correctly renders the embargo start length', () => {
      expect(embargoInteractor.startLength).to.have.string(embargo.movingWallStart.length);
    });

    it('correctly renders the embargo start unit', () => {
      expect(embargoInteractor.startUnit).to.have.string(embargo.movingWallStart.unit);
    });

    it('renders the embargo moving wall end', () => {
      expect(embargoInteractor.movingWallEndExists).to.be.true;
    });

    it('correctly renders the embargo end length', () => {
      expect(embargoInteractor.endLength).to.have.string(embargo.movingWallEnd.length);
    });

    it('correctly renders the embargo end unit', () => {
      expect(embargoInteractor.endUnit).to.have.string(embargo.movingWallEnd.unit);
    });
  });

  describe('Not rendering an empty embargo component ', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Embargo embargo={noEmbargo} />
      );
    });
    it('does not render the embargo', () => {
      expect(embargoInteractor.exists).to.be.false;
    });
  });

  describe('Rendering embargo component without MovingWallEnd', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Embargo embargo={noMovingWallEnd} />
      );
    });
    it('renders the embargo', () => {
      expect(embargoInteractor.exists).to.be.true;
    });

    it('renders the embargo moving wall start', () => {
      expect(embargoInteractor.movingWallStartExists).to.be.true;
    });

    it('correctly renders the embargo start length', () => {
      expect(embargoInteractor.startLength).to.have.string(noMovingWallEnd.movingWallStart.length);
    });

    it('correctly renders the embargo start unit', () => {
      expect(embargoInteractor.startUnit).to.have.string(noMovingWallEnd.movingWallStart.unit);
    });

    it('does not render the embargo moving wall end', () => {
      expect(embargoInteractor.movingWallEndExists).to.be.false;
    });
  });

  describe('Rendering embargo component without MovingWallStart', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Embargo embargo={noMovingWallStart} />
      );
    });
    it('renders the embargo', () => {
      expect(embargoInteractor.exists).to.be.true;
    });

    it('does not render the embargo moving wall start', () => {
      expect(embargoInteractor.movingWallStartExists).to.be.false;
    });

    it('renders the embargo moving wall end', () => {
      expect(embargoInteractor.movingWallEndExists).to.be.true;
    });

    it('correctly renders the embargo end length', () => {
      expect(embargoInteractor.endLength).to.have.string(noMovingWallStart.movingWallEnd.length);
    });

    it('correctly renders the embargo end unit', () => {
      expect(embargoInteractor.endUnit).to.have.string(noMovingWallStart.movingWallEnd.unit);
    });
  });
});
