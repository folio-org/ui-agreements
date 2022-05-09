import React from 'react';
import PropTypes from 'prop-types';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import { MemoryRouter } from 'react-router-dom';
import { Button } from '@folio/stripes/components';
import { Button as ButtonInteractor } from '@folio/stripes-testing';
import {
  agreement,
  agreementLines,
  agreementEresources,
  eresourcesFilterPath,
  interfaces,
  orderLines,
  query,
  settings,
  users,
  stripes,
  tagsEnabled,
  location,
  handlers,
  match,
  intl
} from './testResources';
import translationsProperties from '../../../test/helpers';
import AgreementViewRoute from './AgreementViewRoute';

const AgreementLineButton = (props) => {
  return <Button onClick={props.handlers.onViewAgreementLine}>AgreementLineButton</Button>;
};

const NeedMoreLinesButton = (props) => {
  return <Button onClick={props.handlers.onNeedMoreLines}>NeedMoreLinesButton</Button>;
};

const FilterEResourceButton = (props) => {
  return <Button onClick={props.handlers.onFilterEResources}>FilterEResourceButton</Button>;
};

const FetchCredentialsButton = (props) => {
  return <Button onClick={props.handlers.onFetchCredentials}>FetchCredentialsButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
};

const NeedMoreEResourcesButton = (props) => {
  return <Button onClick={props.handlers.onNeedMoreEResources}>NeedMoreEResourcesButton</Button>;
};

const ToggleTagsButton = (props) => {
  return <Button onClick={props.handlers.onToggleTags}>ToggleTagsButton</Button>;
};

const CloseButton = (props) => {
  return <Button onClick={props.handlers.onClose}>CloseButton</Button>;
};

const ExportEResourcesAsKBARTButton = (props) => {
  return <Button onClick={props.handlers.onExportEResourcesAsKBART}>ExportEResourcesAsKBARTButton</Button>;
};

const ExportEResourcesAsJSONButton = (props) => {
  return <Button onClick={props.handlers.onExportEResourcesAsJSON}>ExportEResourcesAsJSONButton</Button>;
};

const CloneButton = (props) => {
  return <Button onClick={() => props.handlers.onClone({})}>CloneButton</Button>;
};

AgreementLineButton.propTypes = {
  handlers: PropTypes.shape({
    onViewAgreementLine: PropTypes.func,
  }),
};

NeedMoreLinesButton.propTypes = {
  handlers: PropTypes.shape({
    onNeedMoreLines: PropTypes.func,
  }),
};

FilterEResourceButton.propTypes = {
  handlers: PropTypes.shape({
    onFilterEResources: PropTypes.func,
  }),
};

FetchCredentialsButton.propTypes = {
  handlers: PropTypes.shape({
    onFetchCredentials: PropTypes.func,
  }),
};

EditButton.propTypes = {
  handlers: PropTypes.shape({
    onEdit: PropTypes.func,
  }),
};

NeedMoreEResourcesButton.propTypes = {
  handlers: PropTypes.shape({
    onNeedMoreEResources: PropTypes.func,
  }),
};

ToggleTagsButton.propTypes = {
  handlers: PropTypes.shape({
    onToggleTags: PropTypes.func,
  }),
};

CloseButton.propTypes = {
  handlers: PropTypes.shape({
    onClose: PropTypes.func,
  }),
};

ExportEResourcesAsKBARTButton.propTypes = {
  handlers: PropTypes.shape({
    onExportEResourcesAsKBART: PropTypes.func,
  }),
};

ExportEResourcesAsJSONButton.propTypes = {
  handlers: PropTypes.shape({
    onExportEResourcesAsJSON: PropTypes.func,
  }),
};

CloneButton.propTypes = {
  handlers: PropTypes.shape({
    onClone: PropTypes.func,
  }),
};

const originalFetch = window.fetch;
window.fetch = jest.fn((url, options) => {
  return new Promise((resolve, reject) => {
    if (url.includes('export')) { // handle export endpoints
      return resolve({ blob: () => Promise.resolve(true) });
    } else if (url.includes('clone')) {
      return resolve({ ok: true, text: () => Promise.resolve({ id: 123 }) }); // handle clone endpoint
    } else {
      return originalFetch(url, options)
        .then(resp => resolve(resp))
        .catch(error => reject(error));
    }
  });
});

const mutatorReplaceMock = jest.fn();
const historyPushMock = jest.fn();
const mutatorEResourceReplaceMock = jest.fn();
const mutatorFetchReplaceMock = jest.fn();
const mutatorQueryUpdateMock = jest.fn();

jest.mock('../../components/views/Agreement', () => {
  return (props) => (
    <div>
      <div>Agreement</div>
      <AgreementLineButton {...props} />
      <NeedMoreLinesButton {...props} />
      <FilterEResourceButton {...props} />
      <FetchCredentialsButton {...props} />
      <EditButton {...props} />
      <NeedMoreEResourcesButton {...props} />
      <ToggleTagsButton {...props} />
      <CloseButton {...props} />
      <ExportEResourcesAsKBARTButton {...props} />
      <ExportEResourcesAsJSONButton {...props} />
      <CloneButton {...props} />
    </div>
  );
});

const data = {
  handlers,
  history:{
    push: historyPushMock,
  },
  intl,
  location,
  match,
  mutator:{
    agreementLinesOffset:{
      replace: mutatorReplaceMock,
    },
    eresourcesFilterPath:{
      replace: mutatorEResourceReplaceMock,
    },
    agreementEresourcesOffset:{
      replace: mutatorEResourceReplaceMock,
    },
    interfaceRecord:{
      replace: mutatorFetchReplaceMock,
    },
    query:{
      update: mutatorQueryUpdateMock,
    }
  },
  resources: {
    agreement,
    agreementLines,
    agreementEresources,
    eresourcesFilterPath,
    interfaces,
    orderLines,
    query,
    settings,
    users,
  },
  stripes,
  tagsEnabled
};

describe('AgreementViewRoute', () => {
  describe('rendering the AgreementViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      fetch.mockClear();
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties,
      );
    });

    test('renders the Agreement component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Agreement')).toBeInTheDocument();
    });

    test('calls the AgreementLineButton callback', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLineButton')).toBeInTheDocument();
    });

    test('calls the NeedMoreLinesButton callback', () => {
      const { getByText } = renderComponent;
      expect(getByText('NeedMoreLinesButton')).toBeInTheDocument();
    });

    test('triggers the AgreementLineButton callback', async () => {
      await ButtonInteractor('AgreementLineButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('triggers the EditButton callback', async () => {
      await ButtonInteractor('EditButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('calls the NeedMoreLinesButton callback', async () => {
      await ButtonInteractor('NeedMoreLinesButton').click();
      expect(mutatorReplaceMock).toHaveBeenCalled();
    });

    test('triggers the FilterEResourceButton callback', async () => {
      await ButtonInteractor('FilterEResourceButton').click();
      expect(mutatorEResourceReplaceMock).toHaveBeenCalled();
    });

    test('triggers the FetchCredentialsButton callback', async () => {
      await ButtonInteractor('FetchCredentialsButton').click();
      expect(mutatorFetchReplaceMock).toHaveBeenCalled();
    });

    test('triggers the NeedMoreEResourcesButton callback', async () => {
      await ButtonInteractor('NeedMoreEResourcesButton').click();
      expect(mutatorEResourceReplaceMock).toHaveBeenCalled();
    });

    test('triggers the ToggleTagsButton callback', async () => {
      await ButtonInteractor('ToggleTagsButton').click();
      expect(mutatorQueryUpdateMock).toHaveBeenCalled();
    });

    test('triggers the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('triggers the CloneButton callback', async () => {
      await ButtonInteractor('CloneButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('triggers the ExportEResourcesAsKBARTButton callback', async () => {
      await ButtonInteractor('ExportEResourcesAsKBARTButton').click();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test('triggers the ExportEResourcesAsJSONButton callback', async () => {
      await ButtonInteractor('ExportEResourcesAsJSONButton').click();
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    describe('re-rendering the route', () => { // makes sure that we hit the componentDidUpdate block
      beforeEach(() => {
        renderWithIntl(
          <MemoryRouter>
            <AgreementViewRoute {...data} />
          </MemoryRouter>,
          translationsProperties,
          renderComponent.rerender
        );
      });

      test('renders the Agreements component', () => {
        const { getByText } = renderComponent;
        expect(getByText('Agreement')).toBeInTheDocument();
      });
    });
  });
});
