import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Link from 'react-router-dom/Link';
import { injectIntl, intlShape } from 'react-intl';

import {
  Checkbox,
  Col,
  IconButton,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';

class BasketList extends React.Component {
  static propTypes = {
    basket: PropTypes.arrayOf(PropTypes.object),
    intl: intlShape,
    removeItem: PropTypes.func,
  }

  render() {
    const { basket, intl, removeItem } = this.props;

    return (
      <Row>
        <Col xs={12}>
          <MultiColumnList
            contentData={basket}
            maxHeight={400}
            visibleColumns={[
              'name',
              'type',
              'package',
              'publisher',
              'platform',
              'coverageStart',
              'coverageEnd',
              'remove'
            ]}
            formatter={{
              name: item => <Link to={`/erm/eresources/view/${item.id}`}>{item.name}</Link>,
              type: item => (item.class === 'org.olf.kb.Pkg' ?
                intl.formatMessage({ id: 'ui-erm.eresources.package' }) :
                intl.formatMessage({ id: 'ui-erm.eresources.title' })
              ),
              package: item => {
                const pkg = get(item, ['_object', 'pkg']);
                if (!pkg) return '';

                return <Link to={`/erm/eresources/view/${pkg.id}`}>{pkg.name}</Link>;
              },
              publisher: () => 'TBD',
              platform: item => (
                get(item, ['_object', 'pti', 'platform', 'name']) ||
                get(item, ['_object', 'nominalPlatform', 'name'])
              ),
              coverageStart: () => 'TBD',
              coverageEnd: () => 'TBD',
              remove: item => (
                <IconButton
                  aria-label={intl.formatMessage({ id: 'ui-erm.basket.removeItem' })}
                  icon="trashBin"
                  onClick={() => removeItem(item)}
                />
              )
            }}
            columnMapping={{
              name: intl.formatMessage({ id: 'ui-erm.eresources.name' }),
              type: intl.formatMessage({ id: 'ui-erm.eresources.type' }),
              package: intl.formatMessage({ id: 'ui-erm.eresources.parentPackage' }),
              publisher: intl.formatMessage({ id: 'ui-erm.eresources.publisher' }),
              platform: intl.formatMessage({ id: 'ui-erm.eresources.platform' }),
              coverageStart: intl.formatMessage({ id: 'ui-erm.eresources.coverageStart' }),
              coverageEnd: intl.formatMessage({ id: 'ui-erm.eresources.coverageEnd' }),
              remove: intl.formatMessage({ id: 'ui-erm.basket.remove' }),
            }}
            columnWidths={{
              name: '30%',
            }}
          />
        </Col>
      </Row>
    );
  }
}

export default injectIntl(BasketList);
