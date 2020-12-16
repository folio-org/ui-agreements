import React from 'react';
import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { Form } from 'react-final-form';

import { mountWithContext } from '../helpers/mountWithContext';

import { MCLPaginationFields } from '../../../src/settings/components';
import MCLPaginationInteractor from '../interactors/mcl-pagination';

const interactor = new MCLPaginationInteractor();

const mclList = ['agreementLines', 'agreementEresources', 'entitlementOptions', 'packageContents', 'entitlements'];

describe('MCL pagination tests', () => {
  describe('Rendering the "MCL pagination" settings component', () => {
    beforeEach(async function () {
      await mountWithContext(
        <Form
          onSubmit={() => {}}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <MCLPaginationFields />
              </form>
            );
          }}
        />
      );
    });

    describe('MCL pagination description', () => {
      it('renders the description', () => {
        expect(interactor.isDescription).to.be.true;
      });
    });

    mclList.forEach((mcl, i) => {
      describe('MCL pagination fields', () => {
        it(`should render the default page size value of 10 for mcl ${mcl}`, () => {
          expect(interactor.pageSizeFields(i).mclPageSizeField.to.equal(10));
        });
      });
    });
  });
});
