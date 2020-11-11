import React from 'react';
import { describe, beforeEach, it } from '@bigtest/mocha';
import chai from 'chai';
import spies from 'chai-spies';
import { StaticRouter as Router } from 'react-router-dom';
import { mountWithContext } from '../helpers/mountWithContext';

import TitleForm from '../../../src/components/views/TitleForm';

import { titleInstance } from './resources';
import TitleInstanceEditPaneInteractor from '../interactors/title-instance-edit';

chai.use(spies);
const { expect, spy } = chai;

const formProps = {
  eresource: {},
  handlers: {
    isSuppressFromDiscoveryEnabled: spy(resource => resource === 'title'),
    onClose: spy(),
  },
  initialValues: {},
  isLoading: false,
  onSubmit: spy(),
};

/* static propTypes = {
  eresource: PropTypes.object,
  form: PropTypes.shape({
    getRegisteredFields: PropTypes.func.isRequired,
  }).isRequired,
  handlers: PropTypes.PropTypes.shape({
    isSuppressFromDiscoveryEnabled: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  }),
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
} */

describe.only('Title instance edit form', () => {
  const interactor = new TitleInstanceEditPaneInteractor();

  beforeEach(async () => {
    await mountWithContext(
      <Router context={{}}>
        <TitleForm
          {...formProps}
          eresource={{
            titleInstance
          }}
          initialValues={{
            titleInstance
          }}
        />
      </Router>
    );
    await interactor.whenLoaded();
  });

  it('renders the expected suppress from discovery status', () => {
    expect(interactor.suppressFromDiscoveryCheckboxChecked).to.equal(titleInstance.suppressFromDiscovery);
  });

  describe('clicking the suppress from discovery checkbox', () => {
    beforeEach(async () => {
      await interactor.clickSuppressFromDiscoveryCheckbox();
    });
  });

  it('renders the expected changed suppress from discovery status', () => {
    expect(interactor.suppressFromDiscoveryCheckboxChecked).to.not.equal(titleInstance.suppressFromDiscovery);
  });
});
