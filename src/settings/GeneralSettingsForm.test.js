import { FormattedMessage } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Checkbox, Pane, PaneHeader, Button } from '@folio/stripes-erm-testing';

import translationsProperties from '../../test/helpers';
import GeneralSettingsForm from './GeneralSettingsForm';

jest.mock('./components/MCLPaginationFields', () => () => <div>MCLPaginationFields</div>);
jest.mock('./components/SuppressFromDiscoveryFields', () => () => <div>SuppressFromDiscoveryFields</div>);
jest.mock('./components/HideAccordions', () => () => <div>HideAccordions</div>);

const onSubmitMock = jest.fn();

const stripes = {
  hasPerm: () => true,
};


describe('GeneralSettingsForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <MemoryRouter>
        <GeneralSettingsForm
          label={<FormattedMessage id="ui-agreements.settings.displaySettings" />}
          onSubmit={onSubmitMock}
          stripes={stripes}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders Save button', async () => {
    await waitFor(async () => {
      await Checkbox({ id: 'hideEResourcesFunctionality' }).click();
    });
    await Button('Save').exists();
  });

  test('renders the Hide internal agreements knowledgebase Checkbox', async () => {
    await Checkbox({ id: 'hideEResourcesFunctionality' }).exists();
  });

  test('renders the Hide internal agreements knowledgebase checkbox as checked', async () => {
    await Checkbox({ id: 'hideEResourcesFunctionality' }).is({ checked: false });
  });

  test('displays the agreement setting pane', async () => {
    await Pane('Display settings').is({ visible: true });
  });

  test('displays the agreement setting pane header', async () => {
    await PaneHeader('Display settings').is({ visible: true });
  });

  test('renders the MCLPaginationFields component', () => {
    const { getByText } = renderComponent;
    expect(getByText('MCLPaginationFields')).toBeInTheDocument();
  });

  test('renders the SuppressFromDiscoveryFields component', () => {
    const { getByText } = renderComponent;
    expect(getByText('SuppressFromDiscoveryFields')).toBeInTheDocument();
  });

  test('renders the HideAccordions component', () => {
    const { getByText } = renderComponent;
    expect(getByText('HideAccordions')).toBeInTheDocument();
  });

  test('renders expected lists', () => {
    const { getByText } = renderComponent;
    expect(getByText('Hide the E-resources tab in the agreements app')).toBeInTheDocument();
    expect(getByText('Hide the basket icon in the agreements app')).toBeInTheDocument();
    expect(getByText('Hide the "E-resources covered by this agreement" accordion in individual agreements')).toBeInTheDocument();
  });

  test('renders the description paragraph', () => {
    const { getByText } = renderComponent;
    expect(getByText('If you are using another app (e.g. eHoldings) as your knowledge base and wish to hide the internal agreements knowledge base, you can check this setting. Specifically, this will:')).toBeInTheDocument();
  });
});
