import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Col, KeyValue, NoValue, Row } from '@folio/stripes/components';

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

  const identifierSection = (identifierNamespace) => (
    <Col xs={3}>
      <KeyValue
        label={<FormattedMessage id={`ui-agreements.packageIdentifiers.${identifierNamespace}`} />}
        value={identifierValues[identifierNamespace] ? identifierValues[identifierNamespace].value : <NoValue />}
      />
    </Col>
  );

  return (
    <>
      <Row>
        {identifierSection('isil')}
        {identifierSection('zdb')}
        {identifierSection('ezb')}
        {identifierSection('eBookPool')}
      </Row>
      <Row>
        {identifierSection('gokbId')}
        {identifierSection('gokbUUID')}
      </Row>
    </>
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
