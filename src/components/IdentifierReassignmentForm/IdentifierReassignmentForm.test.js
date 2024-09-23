import { useForm } from 'react-final-form';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Button as ButtonInteractor, renderWithIntl } from '@folio/stripes-erm-testing';

import { Button } from '@folio/stripes/components';

import translationsProperties from '../../../test/helpers';
import IdentifierReassignmentForm from './IdentifierReassignmentForm';

import DestinationTitleIdentifierField from './DestinationTitleIdentifierField';
import SourceTitleIdentifierField from './SourceTitleIdentifierField';

const onCloseMock = jest.fn();

const MockSourceTitleIdentifierField = ({ setTitleName }) => {
  return (
    <>
      <Button
        onClick={() => setTitleName('test source title')}
      >
        setSourceTitle
      </Button>
      <div>SourceTitleIdentifierField</div>
    </>
  );
};

const MockDestinationTitleIdentifierField = ({ setTitleName }) => {
  const { change } = useForm();

  return (
    <>
      <Button
        onClick={() => {
          change('destinationTitle', 'test destination title');
          setTitleName('test destination title');
        }}
      >
        setDestinationTitle
      </Button>
      <div>DestinationTitleIdentifierField</div>
    </>
  );
};

/* EXAMPLE testing, mocking Component with complicated return */
jest.mock('./SourceTitleIdentifierField');
jest.mock('./DestinationTitleIdentifierField');
SourceTitleIdentifierField.mockImplementation(MockSourceTitleIdentifierField);
DestinationTitleIdentifierField.mockImplementation(MockDestinationTitleIdentifierField);

jest.mock('./SourceTitlePreview/SourceTitlePreview', () => () => <div>SourceTitlePreview</div>);
jest.mock('./DestinationTitlePreview/DestinationTitlePreview', () => () => <div>DestinationTitlePreview</div>);

describe('IdentifierReassignmentForm', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      <IdentifierReassignmentForm
        data={{}}
        form={{
          change: () => jest.fn(),
        }}
        handlers={{
          onClose: onCloseMock,
        }}
        open
      />,
      translationsProperties
    );
  });

  test('renders the identifierReassignmentForm form', () => {
    const { getByTestId } = renderComponent;
    expect(getByTestId('identifierReassignmentForm')).toBeInTheDocument();
  });

  describe('Before picking resources', () => {
    it('renders the SourceTitleIdentifierField component', () => {
      const { getByText } = renderComponent;
      expect(getByText('SourceTitleIdentifierField')).toBeInTheDocument();
    });

    it('renders the DestinationTitleIdentifierField component', () => {
      const { getByText } = renderComponent;
      expect(getByText('DestinationTitleIdentifierField')).toBeInTheDocument();
    });

    it('renders a disabled \'preview\' button', async () => {
      await ButtonInteractor('Preview').has({ disabled: true });
    });
  });

  describe('Picking resources', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        // Set source/destination titles
        await ButtonInteractor('setSourceTitle').click();
        await ButtonInteractor('setDestinationTitle').click();
      });
    });

    test('preview button becomes enabled', async () => {
      await waitFor(async () => {
        await ButtonInteractor('Preview').exists();
      });
    });

    describe('clicking preview button', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await ButtonInteractor('Preview').click();
        });
      });

      it('renders the SourceTitlePreview component', async () => {
        const { getByText } = renderComponent;
        await waitFor(async () => {
          expect(getByText('SourceTitlePreview')).toBeInTheDocument();
        });
      });

      it('renders the DestinationTitlePreview component', async () => {
        const { getByText } = renderComponent;
        await waitFor(async () => {
          expect(getByText('DestinationTitlePreview')).toBeInTheDocument();
        });
      });
    });
  });
});
