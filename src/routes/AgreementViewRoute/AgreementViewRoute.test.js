/* eslint-disable react/prop-types */
import React from 'react';
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

const mutatorReplaceMock = jest.fn();
const historyPushMock = jest.fn();
const mutatorEResourceReplaceMock = jest.fn();
const mutatorFetchReplaceMock = jest.fn();
const queryUpdateMock = jest.fn();

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
      update: queryUpdateMock,
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
  describe('rendering the agreementViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
      renderComponent = renderWithIntl(
        <MemoryRouter>
          <AgreementViewRoute {...data} />
        </MemoryRouter>,
        translationsProperties
      );
    });

    test('renders the agreement component', () => {
      const { getByText } = renderComponent;
      expect(getByText('Agreement')).toBeInTheDocument();
    });

    test('calls the AgreementLineButton ', () => {
    const { getByText } = renderComponent;
    expect(getByText('AgreementLineButton')).toBeInTheDocument();
    });

    test('calls the NeedMoreLinesButton ', () => {
    const { getByText } = renderComponent;
    expect(getByText('NeedMoreLinesButton')).toBeInTheDocument();
    });

    test('renders the AgreementLineButton callback', async () => {
      await ButtonInteractor('AgreementLineButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('renders the EditButton callback', async () => {
      await ButtonInteractor('EditButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });

    test('renders the  NeedMoreLinesButton callback', async () => {
      await ButtonInteractor('NeedMoreLinesButton').click();
      expect(mutatorReplaceMock).toHaveBeenCalled();
    });

    test('renders the FilterEResourceButton callback', async () => {
      await ButtonInteractor('FilterEResourceButton').click();
      expect(mutatorEResourceReplaceMock).toHaveBeenCalled();
    });

    test('renders the FetchCredentialsButton callback', async () => {
      await ButtonInteractor('FetchCredentialsButton').click();
      expect(mutatorFetchReplaceMock).toHaveBeenCalled();
    });

    test('renders the NeedMoreEResourcesButton callback', async () => {
      await ButtonInteractor('NeedMoreEResourcesButton').click();
      expect(mutatorEResourceReplaceMock).toHaveBeenCalled();
    });

    test('renders the ToggleTagsButton callback', async () => {
      await ButtonInteractor('ToggleTagsButton').click();
      expect(queryUpdateMock).toHaveBeenCalled();
    });

    test('renders the CloseButton callback', async () => {
      await ButtonInteractor('CloseButton').click();
      expect(historyPushMock).toHaveBeenCalled();
    });
  });
});
