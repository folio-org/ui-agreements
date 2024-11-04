
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Accordion, Button, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Lines from './Lines';
import { agreement, handlers } from './testResources';

jest.mock('../CoveredEResourcesList', () => () => (
  <div>CoveredEResourcesList</div>
));

jest.mock('../LinesList', () => () => (
  <div>LinesList</div>
));

describe('Lines', () => {
  let renderComponent;
  beforeEach(() => {
    renderComponent = renderWithIntl(
      /* EXAMPLE testing "to" redirects using memory router */
      <MemoryRouter>
        <Switch>
          <Route path="/erm/agreements/:agreementId/line/create">
            Create agreement line
          </Route>
          <Route path="/erm/agreementLines">
            View agreement lines
          </Route>
          <Route path="/">
            <Lines
              agreement={agreement}
              handlers={handlers}
            />
          </Route>
        </Switch>
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders Agreement lines Accordion', async () => {
    await Accordion('Agreement lines').exists();
  });

  test('renders LinesList component', async () => {
    const { getByText } = renderComponent;
    await waitFor(() => {
      expect(getByText('LinesList')).toBeInTheDocument();
    });
  });

  test('renders CoveredEResourcesList component', async () => {
    const { getByText } = renderComponent;
    await waitFor(() => {
      expect(getByText('CoveredEResourcesList')).toBeInTheDocument();
    });
  });

  test('actions menu exists', async () => {
    await Button('Actions').exists();
  });

  describe('opening actions menu', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('Actions').click();
      });
    });

    test('New agreement line button exists', async () => {
      await waitFor(async () => {
        await Button('New agreement line').exists();
      });
    });

    test('View in agreement lines search button exists', async () => {
      await waitFor(async () => {
        await Button('View in agreement lines search').exists();
      });
    });

    test('renders ColumnManagerMenu component', async () => {
      const { getByText } = renderComponent;
      await waitFor(() => {
        expect(getByText('ColumnManagerMenu')).toBeInTheDocument();
      });
    });


    describe('clicking new agreement line button', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('New agreement line').click();
        });
      });

      test('redirected to agreement line screen', async () => {
        const { getByText } = renderComponent;
        await waitFor(async () => {
          expect(getByText('Create agreement line')).toBeInTheDocument();
        });
      });
    });

    describe('clicking view in agreement lines search button', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await Button('View in agreement lines search').click();
        });
      });

      test('redirected to agreement line screen', async () => {
        const { getByText } = renderComponent;
        await waitFor(async () => {
          expect(getByText('View agreement lines')).toBeInTheDocument();
        });
      });
    });
  });
});
