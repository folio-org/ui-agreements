import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { renderWithIntl, Accordion, MultiColumnList, MultiColumnListCell, Button } from '@folio/stripes-erm-testing';

import translationsProperties from '../../../../test/helpers';
import PlatformProxySettings from './PlatformProxySettings';

const onClickProxyServerAction = jest.fn();

const noProxydata = {
  'id': 'platformProxySettings',
  'platform': {
    'id': 'da13e608-7524-4e9b-bf66-93fe8459337f',
    'dateCreated': '2021-10-08T05:48:14Z',
    'lastUpdated': '2021-10-08T05:48:14Z',
    'name': 'Mathematical Sciences Publishers',
    'locators': [{
      'id': '2b8d8f3c-f844-4fe8-a561-eccc6277465d',
      'domainName': 'msp.org'
    }]
  },
  'handlers': {
    'onClose': jest.fn(),
    'onEdit': jest.fn(),
    'onViewUrlCustomizer': jest.fn(),
    'onClickProxyServerAction': jest.fn()
  },
  'stringTemplates': {
    'urlProxiers': '[]',
    'urlCustomisers': '[]'
  },
  'proxyServers': []
};

const data = {
  'id': 'platformProxySettings',
  'platform': {
    'id': '5707f468-7a15-410c-b3ca-8a2b4240d2fc',
    'dateCreated': '2021-10-08T06:02:54Z',
    'lastUpdated': '2021-10-08T11:10:40Z',
    'name': 'ASCE Library',
    'localCode': '2222',
    'locators': [{
      'id': '89caf82c-329d-4911-a51b-d81b7d2c5259',
      'domainName': 'ascelibrary.org'
    }]
  },
  'handlers': {
    'onClose': jest.fn(),
    'onEdit': jest.fn(),
    'onViewUrlCustomizer': jest.fn(),
    'onClickProxyServerAction': jest.fn()
  },
  'stringTemplates': {
    'urlProxiers': [{
      'id': '946aa36d-0f64-4f35-8609-69740a930721',
      'dateCreated': '2021-10-08T11:15:02Z',
      'rule': '1111',
      'context': {
        'id': '2c91809c7c5e654e017c5e6d38900040'
      },
      'lastUpdated': '2021-10-08T12:05:48Z',
      'name': 'proxy test two',
      'idScopes': [
        '55027edb-d57a-4984-a14c-8e59802dd775',
        'da13e608-7524-4e9b-bf66-93fe8459337f'
      ]
    }],
    'urlCustomisers': [{
      'id': 'e0c27de7-eb89-4bdb-b63f-f5b62aa60e76',
      'dateCreated': '2021-10-08T11:12:39Z',
      'rule': '2222',
      'context': {
        'id': '2c91809c7c5e654e017c5e6d38950041'
      },
      'lastUpdated': '2021-10-08T11:12:39Z',
      'name': 'test',
      'idScopes': [
        '5707f468-7a15-410c-b3ca-8a2b4240d2fc'
      ]
    }]
  },
  'proxyServers': [{
    'id': 'e3fc75bb-ceae-4e4b-8d0c-273dc445a2cf',
    'dateCreated': '2021-10-08T11:13:31Z',
    'rule': '2222',
    'context': {
      'id': '2c91809c7c5e654e017c5e6d38900040',
      'value': 'urlproxier',
      'label': 'urlProxier'
    },
    'lastUpdated': '2021-10-08T11:40:44Z',
    'name': 'proxy test',
    'idScopes': [
      '5707f468-7a15-410c-b3ca-8a2b4240d2fc',
      'cb7679af-b7ed-44ae-a3a5-96a1082e14df'
    ]
  },
  {
    'id': '946aa36d-0f64-4f35-8609-69740a930721',
    'dateCreated': '2021-10-08T11:15:02Z',
    'rule': '1111',
    'context': {
      'id': '2c91809c7c5e654e017c5e6d38900040',
      'value': 'urlproxier',
      'label': 'urlProxier'
    },
    'lastUpdated': '2021-10-08T12:05:48Z',
    'name': 'proxy test two',
    'idScopes': [
      '55027edb-d57a-4984-a14c-8e59802dd775',
      'da13e608-7524-4e9b-bf66-93fe8459337f'
    ]
  }
  ]
};

describe('PlatformProxySettings', () => {
  describe('without proxy settings', () => {
    beforeEach(() => {
      renderWithIntl(
        <PlatformProxySettings
          handlers={noProxydata.handlers}
          id={noProxydata.id}
          onClickProxyServerAction={onClickProxyServerAction}
          platform={noProxydata.platform}
          proxyServers={noProxydata.proxyServers}
        />,
        translationsProperties
      );
    });

    test('renders the PlatformProxySettings Accordion', async () => {
      await Accordion('Platform proxy server settings').exists();
    });
  });

  describe('with proxy settings', () => {
    beforeEach(() => {
      renderWithIntl(
        <PlatformProxySettings
          handlers={data.handlers}
          id={data.id}
          onClickProxyServerAction={onClickProxyServerAction}
          platform={data.platform}
          proxyServers={data.proxyServers}
        />,
        translationsProperties
      );
    });

    test('renders the PlatformProxySettings Accordion', async () => {
      await Accordion('Platform proxy server settings').exists();
    });

    test('renders the platformProxySettings list MCL', async () => {
      await MultiColumnList('url-customization').exists();
    });

    test('renders expected column count', async () => {
      await MultiColumnList({ columnCount: 3 }).exists();
    });

    test('renders expected columns', async () => {
      await MultiColumnList({ columns: ['Name', 'Status', 'Actions'] }).exists();
    });

    test('renders expected name value in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 0 }).has({ content: 'proxy test' }),
        await MultiColumnListCell({ row: 1, columnIndex: 0 }).has({ content: 'proxy test two' }),
      ]);
    });

    test('renders expected status value in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 1 }).has({ content: 'Not used' }),
        await MultiColumnListCell({ row: 1, columnIndex: 1 }).has({ content: 'Used' })
      ]);
    });

    test('renders expected actions value in the row', async () => {
      Promise.all([
        await MultiColumnListCell({ row: 0, columnIndex: 2 }).has({ content: 'Use this proxyUse the proxy "proxy test" for the platform "ASCE Library"' }),
        await MultiColumnListCell({ row: 1, columnIndex: 2 }).has({ content: 'Do not use this proxyDo not use the proxy "proxy test two" for the platform "ASCE Library"' })
      ]);
    });

    test('renders do not use this proxy button', async () => {
      await Button('Do not use this proxy').exists();
    });

    test('renders use this proxy button', async () => {
      await Button('Use this proxy').exists();
    });

    describe('Clicking the row', () => {
      beforeEach(async () => {
        await waitFor(async () => {
          await MultiColumnList('url-customization').click({ row: 0, columnIndex: 0 });
          await MultiColumnList('url-customization').click({ row: 1, columnIndex: 0 });
        });
      });

      test('should not call the onViewUrlCustomizer callback', () => {
        expect(onClickProxyServerAction).not.toHaveBeenCalled();
      });
    });
  });
});
