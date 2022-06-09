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

  const isil = findIdByNamespace('isil');
  const zdb = findIdByNamespace('zdb-pkg');
  const ezb = findIdByNamespace('ezb-collection-id');
  const eBookPool = findIdByNamespace('ebp-id-pkg');
  const gokbId = findIdByNamespace('gokb_id');
  const gokbUUID = findIdByNamespace('gokb_uuid');

  return (
    <>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.packageIdentifiers.isil" />}
            value={isil ? isil.value : <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.packageIdentifiers.zdb" />}
            value={zdb ? zdb.value : <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.packageIdentifiers.ezb" />}
            value={ezb ? ezb.value : <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.packageIdentifiers.eBookPool" />}
            value={eBookPool ? eBookPool.value : <NoValue />}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.packageIdentifiers.gokbId" />}
            value={gokbId ? gokbId.value : <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.packageIdentifiers.gokbUUID" />}
            value={gokbUUID ? gokbUUID.value : <NoValue />}
          />
        </Col>
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
