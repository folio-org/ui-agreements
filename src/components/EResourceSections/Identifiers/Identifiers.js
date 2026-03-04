import React, { useState } from 'react';
import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Accordion,
  Badge,
  Col,
  MultiColumnList,
  Row
} from '@folio/stripes/components';

const Identifiers = ({
  eresource: { identifiers },
  id
}) => {
  const intl = useIntl();
  console.log('identifiers', identifiers);

  const [sortedColumn, setSortedColumn] = useState('type');
  const [sortDirection, setSortDirection] = useState('ascending');

  const getType = item => intl.formatMessage({
    id: `ui-agreements.eresources.identifiers.${item.identifier.ns.value}`,
    defaultMessage: item.identifier.ns.value
  });

  const sortedIdentifiers = orderBy(
    identifiers,
    [item => (sortedColumn === 'identifier' ? item.identifier.value : getType(item))],
    [sortDirection === 'ascending' ? 'asc' : 'desc']
  );

  const onHeaderClick = (_e, { name }) => {
    if (name === sortedColumn) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortedColumn(name);
      setSortDirection('ascending');
    }
  };

  const renderBadge = () => {
    const count = identifiers.length;
    return <Badge>{count}</Badge>;
  };

  return (
    <Accordion
      displayWhenClosed={renderBadge()}
      displayWhenOpen={renderBadge()}
      id={id}
      label={<FormattedMessage id="ui-agreements.eresources.identifiers" />}
    >
      <Row>
        <Col xs={12}>
          <MultiColumnList
            columnMapping={{
              identifier: <FormattedMessage id="ui-agreements.eresources.identifiers.resourceIdentifier" />,
              type: <FormattedMessage id="ui-agreements.eresources.identifiers.resourceIdentifierType" />
            }}
            contentData={sortedIdentifiers}
            formatter={{
              identifier: item => item.identifier.value,
              type: item => getType(item)
            }}
            id="identifiers-list"
            onHeaderClick={onHeaderClick}
            sortableFields={['type', 'identifier']}
            sortDirection={sortDirection}
            sortedColumn={sortedColumn}
            visibleColumns={['type', 'identifier']}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Identifiers.propTypes = {
  eresource: PropTypes.shape({
    identifiers: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.shape({
        value: PropTypes.string,
        ns: PropTypes.shape({
          value: PropTypes.string
        })
      })
    })),
  }),
  id: PropTypes.string.isRequired
};

export default Identifiers;
