import PropTypes from 'prop-types';

import { useQuery } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';
import { Button } from '@folio/stripes/components';

import translationsProperties from '../../../test/helpers';
import AgreementViewRoute from './AgreementViewRoute';
import {
  agreement,
  location,
  match,
} from './testResources';

const AgreementLineButton = (props) => {
  return <Button onClick={props.handlers.onViewAgreementLine}>AgreementLineButton</Button>;
};


const FilterEResourceButton = (props) => {
  return <Button onClick={props.handlers.onFilterEResources}>FilterEResourceButton</Button>;
};

const EditButton = (props) => {
  return <Button onClick={props.handlers.onEdit}>EditButton</Button>;
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

FilterEResourceButton.propTypes = {
  handlers: PropTypes.shape({
    onFilterEResources: PropTypes.func,
  }),
};

EditButton.propTypes = {
  handlers: PropTypes.shape({
    onEdit: PropTypes.func,
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

const historyPushMock = jest.fn();

jest.mock('../../components/views/Agreement', () => {
  return (props) => (
    <div>
      <div>Agreement</div>
      <AgreementLineButton {...props} />
      <FilterEResourceButton {...props} />
      <EditButton {...props} />
      <ToggleTagsButton {...props} />
      <CloseButton {...props} />
      <ExportEResourcesAsKBARTButton {...props} />
      <ExportEResourcesAsJSONButton {...props} />
      <CloneButton {...props} />
    </div>
  );
});

const data = {
  history:{
    push: historyPushMock,
  },
  location,
  match,
};

useQuery.mockImplementation(() => ({ data: agreement, isLoading: false }));

describe('AgreementViewRoute', () => {
  describe('rendering the AgreementViewRoute', () => {
    let renderComponent;
    beforeEach(() => {
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

    test('renders the AgreementLineButton', () => {
      const { getByText } = renderComponent;
      expect(getByText('AgreementLineButton')).toBeInTheDocument();
    });

    test('triggers the AgreementLineButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('AgreementLineButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('triggers the EditButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('EditButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('triggers the CloseButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloseButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
    });

    test('triggers the CloneButton callback', async () => {
      await waitFor(async () => {
        await ButtonInteractor('CloneButton').click();
      });

      await waitFor(async () => {
        expect(historyPushMock).toHaveBeenCalled();
      });
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
