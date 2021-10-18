import React from 'react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { StaticRouter as Router } from 'react-router-dom';
import { KeyValue } from '@folio/stripes-testing';
import { renderWithIntl } from '@folio/stripes-erm-components/test/jest/helpers';
import translationsProperties from '../../../test/helpers';
import PackageCard from './PackageCard';

const pkg = {
    'id': 'd01a73b8-2978-40dc-88bb-820e96794b4a',
    'vendor': {
        'id': '5bb9ab56-2833-45e5-bca0-25445b23758f',
        'name': 'JSTOR',
    },
    'source': 'GOKb',
    'name': 'JSTOR : Arts & Sciences III Collection : NK',
    'reference': 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK',
    'resourceCount': 228,
    'class': 'org.olf.kb.Pkg'
};

let renderComponent;
describe('PackageCard', () => {
    describe('with pkg resource', () => {
        beforeEach(() => {
            renderComponent = renderWithIntl(
              <Router>
                <PackageCard
                  pkg={pkg}
                />
              </Router>,
            translationsProperties
            );
        });
        test('renders PackageCard component', () => {
            const { getByTestId } = renderComponent;
            expect(getByTestId('packageCard')).toBeInTheDocument();
        });

        test('renders a link with the pkg name', () => {
            const { getByRole } = renderComponent;
            expect(getByRole('link', { name: 'JSTOR : Arts & Sciences III Collection : NK' })).toBeInTheDocument();
        });

        test('renders the expected publicationType', async () => {
            await KeyValue('Publication type').has({ value: 'Package' });
        });

        test('renders the expected resourceCount', async () => {
            await KeyValue('Count').has({ value: '228' });
        });

        test('renders the expected vendorName', async () => {
            await KeyValue('Provider').has({ value: 'JSTOR' });
        });

        test('renders the expected source', async () => {
            await KeyValue('Source').has({ value: 'GOKb' });
        });

        test('renders the expected reference', async () => {
            await KeyValue('Reference').has({ value: 'JSTOR_:_Arts_&_Sciences_III_Collection_:_NK' });
        });
    });
});
