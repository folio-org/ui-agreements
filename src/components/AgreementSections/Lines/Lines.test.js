
import { screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Accordion, Button, MultiColumnList, renderWithIntl } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import translationsProperties from '../../../../test/helpers';
import Lines from './Lines';
import { agreement, handlers } from './testResources';

describe('Lines', () => {
  beforeEach(() => {
    renderWithIntl(
      <MemoryRouter>
        <Lines
          agreement={agreement}
          handlers={handlers}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  test('renders Agreement lines Accordion', async () => {
    await Accordion('Agreement lines').exists();
  });

  describe('Actions menu', () => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Button('Actions').exists();
        await Button('Actions').click();
      });
    });

    test('New agreement line button exists', async () => {
      await waitFor(async () => {
        await Button('New agreement line').exists();
      });
    });

    test('View in agreement lines search button exists', async () => {
      screen.debug();
      await waitFor(async () => {
        await Button('View in agreement lines search').exists();
      });
    });
  });

  test('renders Lines list MCL', async () => {
    await MultiColumnList('agreement-lines').exists();
  });

  test('renders covered e-resources MCL', async () => {
    await MultiColumnList('eresources-covered').exists();
  });
});
