import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '../helpers/mountWithContext';
import PackageCard from '../../../src/components/PackageCard';

import { pci } from './resources';
import PackageCardInteractor from '../interactors/package-card';

chai.use(spies);
const { expect } = chai;

describe('PackageCard', () => {
  const interactor = new PackageCardInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Router context={{}}>
        <PackageCard pkg={pci.pkg} />
      </Router>
    );
  });

  it('should render expected package name', () => {
    expect(interactor.packageName).to.equal(pci.pkg.name);
  });

  it('should render expected resource count', () => {
    expect(interactor.resourceCount).to.have.string(pci.pkg.resourceCount);
  });

  it('should render expected vendor name', () => {
    expect(interactor.vendorName).to.equal(pci.pkg.vendor.name);
  });

  it('should render expected package source', () => {
    expect(interactor.packageSource).to.equal(pci.pkg.source);
  });

  it('should render expected package reference', () => {
    expect(interactor.packageReference).to.equal(pci.pkg.reference);
  });
});
