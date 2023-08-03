
import { renderWithIntl, Accordion, Button, MultiColumnList } from '@folio/stripes-erm-testing';
import { MemoryRouter } from 'react-router-dom';
import Lines from './Lines';
import translationsProperties from '../../../../test/helpers';
import { agreement, handlers } from './testResources';
import { waitFor } from '@folio/jest-config-stripes/testing-library/react';

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

  test('renders Action menu', async () => {
    await Button('Actions').exists();
  });

  test('Action menu has two items', async () => {
    await waitFor(async () => {
      await Button('Actions').click();
      await Button('New agreement line').click();
      await Button('View in agreement lines search').click();
    });
  });

  test('renders Lines list MCL', async () => {
    await MultiColumnList('agreement-lines').exists();
  });

  test('renders covered e-resources MCL', async () => {
    await MultiColumnList('eresources-covered').exists();
  });
});
