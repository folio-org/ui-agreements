import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, KeyValue, Row } from '@folio/stripes/components';
import chunk from 'lodash/chunk';

const ROW_SIZE = 4;

const PackageIdentifiers = ({
  pkg: {
    identifiers
  }
}) => {
  /* Assume for now there's only one entry for each apckage namespace */
  const findIdByNamespace = (ns) => {
    return identifiers?.find(id => id?.identifier?.ns?.value === ns)?.identifier;
  };

  const identifierValues = {
    isil: findIdByNamespace('isil'),
    zdb: findIdByNamespace('zdb-pkg'),
    ezb: findIdByNamespace('ezb-collection-id'),
    eBookPool: findIdByNamespace('ebp-id-pkg'),
    gokbId: findIdByNamespace('gokb_id'),
    gokbUUID: findIdByNamespace('gokb_uuid')
  };

  const identifiersSection = () => {
    const identifierRenderArray = [];

    for (const [key, value] of Object.entries(identifierValues)) {
      if (value) {
        identifierRenderArray.push(
          <Col key={`package-identifier-${key}`} xs={3}>
            <KeyValue
              label={<FormattedMessage id={`ui-agreements.packageIdentifiers.${key}`} />}
              value={value.value}
            />
          </Col>
        );
      }
    }

    // Chunk into rows of 4 (Should stay dynamic however many we add in future)
    const rowChunkedArray = chunk(identifierRenderArray, ROW_SIZE);
    return rowChunkedArray.map((elements, index) => <Row key={`package-identifiers-row-${index}`}>{elements}</Row>);
  };

  return (
    identifiersSection()
  );
};

PackageIdentifiers.propTypes = {
  pkg: PropTypes.shape({
    identifiers: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.shape({
        value: PropTypes.string.isRequired,
        ns: PropTypes.shape({
          value: PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }))
  })
};

export default PackageIdentifiers;
