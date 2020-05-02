import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '../helpers/mountWithContext';
// import PackageContentItemView from '../../../src/components/views/PackageContentItem';
import ParentPackageDetails from '../../../src/components/EResourceSections/ParentPackageDetails';
// import { PCIFormCoverage } from '../../../src/components/EResourceSections';

import { pci } from './resources';
import ParentPackageDetailsInteractor from '../interactors/pci-parent-package-details';

chai.use(spies);
const { expect } = chai;

// const onClose = spy();

// const entitlementOptions = [];
// const entitlements = [];

// const data = {
//   pci,
//   entitlementOptions,
//   entitlements,
//   isLoading: false
// };

// const handlers = { onClose };

// describe.only('PackageContentItemView', () => {
//   // describe('view', () => {
//   //   beforeEach(async () => {
//   //     await mountWithContext(
//   //       <Router>
//   //         <PackageContentItemView
//   //           data={data}
//   //           handlers={handlers}
//   //         />
//   //       </Router>
//   //     );
//   //   });

//   //   it('onClone callback should be called', () => {
//   //     expect(onClone).to.have.been.called();
//   //   });
//   // });

describe('Parent package details', () => {
  const interactor = new ParentPackageDetailsInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Router context={{}}>
        <ParentPackageDetails
          pkg={pci.pkg}
        />
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
