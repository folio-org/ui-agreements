
import { MemoryRouter } from 'react-router-dom';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useHandleSubmitSearch } from '@folio/stripes-erm-components';
import { Button, MultiColumnList, Pane, renderWithIntl, TextField, Checkbox } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import Packages from './Packages';
import { data, source, searchString, selectedRecordId } from './testResources';

jest.mock('../../EResourceProvider', () => () => <div>EResourceProvider</div>);
jest.mock('../../PackageFilters', () => () => <div>PackageFilters</div>);

jest.mock('../../RouteSwitcher', () => () => <div>RouteSwitcher</div>);

const mockSubmit = jest.fn(e => e.preventDefault());
const queryGetter = jest.fn();
const querySetter = jest.fn();
const onSelectPackageIds = jest.fn();
const handleSyncPackages = jest.fn();

describe('Packages', () => {
  useHandleSubmitSearch.mockImplementation(() => ({
    handleSubmitSearch: mockSubmit,
    resultsPaneTitleRef: null
  }));

  let renderComponent;
  beforeEach(() => {
    // Start in `/erm/titles` to allow for testing of routeSwitcher
    renderComponent = renderWithIntl(
      <MemoryRouter initialEntries={['/erm/titles']}>
        <Packages
          data={data}
          handleSyncPackages={handleSyncPackages}
          history={{ push: jest.fn() }}
          onSelectPackageIds={onSelectPackageIds}
          queryGetter={queryGetter}
          querySetter={querySetter}
          searchString={searchString}
          selectedRecordId={selectedRecordId}
          source={source}
        />
      </MemoryRouter>,
      translationsProperties
    );
  });

  describe('Rendering the component', () => {
    describe('Search and Filter Pane', () => {
      test('renders the expected Search and Filter Pane', async () => {
        await Pane('Search and filter').is({ visible: true });
      });

      test('renders the RouteSwitcher', () => {
        const { getByText } = renderComponent;
        expect(getByText('RouteSwitcher')).toBeInTheDocument();
      });

      test('renders the Search button (disabled)', async () => {
        await Button('Search').has({ disabled: true });
      });

      test('renders the reset all button (disabled)', async () => {
        await Button('Reset all').has({ disabled: true });
      });

      describe('filling in the search field', () => {
        beforeEach(async () => {
          await waitFor(async () => {
            await TextField({ id: 'input-package-search' }).fillIn('test'); // enables the disabled buttons
          });
        });

        test('renders the Search button', async () => {
          await waitFor(async () => {
            await Button('Search').exists();
          });
        });

        test('renders the reset all button', async () => {
          await waitFor(async () => {
            await Button('Reset all').exists();
          });
        });

        describe('Interacting with the search functionality', () => {
          beforeEach(async () => {
            await waitFor(async () => {
              await Button('Search').click();
            });
          });

          test('triggering the search should invoke the useHandleSubmitSearch hook', async () => {
            await waitFor(async () => {
              expect(mockSubmit).toHaveBeenCalled();
            });
          });
        });

        it('renders the PackageFilters component', () => {
          const { getByText } = renderComponent;
          expect(getByText('PackageFilters')).toBeInTheDocument();
        });
      });
    });

    describe('Packages Pane', () => {
      test('renders the expected Packages Pane', async () => {
        await Pane('Packages').is({ visible: true });
      });

      test('renders the expected number of MCL columns', async () => {
        await MultiColumnList({ columnCount: 6 }).exists();
      });

      test('renders the expected number of MCL rows', async () => {
        await MultiColumnList({ rowCount: 2 }).exists();
      });

      test('renders expected packages columns', async () => {
        await MultiColumnList({
          columns: [
            '',
            'Name',
            'Provider',
            'Source (external data source)',
            'Status',
            'Synchronisation status',
          ],
        }).exists();
      });

      it('renders the EResourceProvider component', () => {
        const { queryAllByText } = renderComponent;
        expect(queryAllByText('EResourceProvider')).toHaveLength(2);
      });

      const actionsMenuTestSuite = (hasSelectedPackages = false) => {
        return describe('Actions Menu', () => {
          test('renders the expected Actions button', async () => {
            await Button('Actions').exists();
          });

          describe('clicking the actions menu', () => {
            beforeEach(async () => {
              await waitFor(async () => {
                await Button('Actions').click();
              });
            });

            test.each([
              'Start synchronisation of selected packages',
              'Pause synchronisation of selected packages'
            ])(`'%s' button ${hasSelectedPackages ? 'exists' : 'is disabled'}`, async (buttonLabel) => {
              if (hasSelectedPackages) {
                await waitFor(async () => {
                  await Button(buttonLabel).exists();
                });
              } else {
                await waitFor(async () => {
                  await Button(buttonLabel).has({ disabled: true });
                });
              }
            });
          });
        });
      };

      describe('Selecting Packages', () => {
        actionsMenuTestSuite();
        describe('Selecting a single package', () => {
          beforeEach(async () => {
            onSelectPackageIds.mockClear();

            await waitFor(async () => {
              await Checkbox({ name: `select-${data.packages[0].id}` }).click();
            });
          });

          actionsMenuTestSuite(true);

          test('selected package checkbox is selected', async () => {
            await waitFor(async () => {
              await Checkbox({ name: `select-${data.packages[0].id}` }).is({ checked: true });
            });
          });

          test('other package checkbox is not selected', async () => {
            await waitFor(async () => {
              await Checkbox({ name: `select-${data.packages[1].id}` }).is({ checked: false });
            });
          });

          test('onSelectPackageIds has been called once', () => {
            expect(onSelectPackageIds.mock.calls.length).toBe(1);
          });

          test('onSelectPackageIds has been called with expected id', () => {
            expect(onSelectPackageIds).toHaveBeenCalledWith([data.packages[0].id]);
          });
        });

        describe('Selecting all packages', () => {
          beforeEach(async () => {
            onSelectPackageIds.mockClear();
            await waitFor(async () => {
              await Checkbox({ name: 'select-all' }).click();
            });
          });
          actionsMenuTestSuite(true);

          // Use test.each, not test with a forEach
          test.each(data.packages)('Package ($id) is selected', async ({ id }) => {
            await waitFor(async () => {
              await Checkbox({ name: `select-${id}` }).is({ checked: true });
            });
          });

          test('onSelectPackageIds has been called once', () => {
            expect(onSelectPackageIds.mock.calls.length).toBe(1);
          });

          test('onSelectPackageIds has been called with expected ids', () => {
            expect(onSelectPackageIds).toHaveBeenCalledWith(data.packages.map(p => p.id));
          });

          describe('deselecting all packages', () => {
            beforeEach(async () => {
              onSelectPackageIds.mockClear();
              await waitFor(async () => {
                await Checkbox({ name: 'select-all' }).click();
              });
            });

            actionsMenuTestSuite();

            test.each(data.packages)('Package ($id) is not selected', async ({ id }) => {
              await waitFor(async () => {
                await Checkbox({ name: `select-${id}` }).is({ checked: false });
              });
            });

            test('onSelectPackageIds has been called once', () => {
              expect(onSelectPackageIds.mock.calls.length).toBe(1);
            });

            test('onSelectPackageIds has been called with expected ids', () => {
              expect(onSelectPackageIds).toHaveBeenCalledWith([]);
            });
          });
        });
      });
    });
  });
});
