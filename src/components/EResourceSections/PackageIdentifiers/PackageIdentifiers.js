import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue } from '@folio/stripes/components';
import { renderDynamicRows } from '@folio/stripes-erm-components';

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
    'ebp-id-pkg': findIdByNamespace('ebp-id-pkg'),
    gokb_id: findIdByNamespace('gokb_id'),
    gokb_uuid: findIdByNamespace('gokb_uuid')
  };

  return (
    renderDynamicRows(
      Object.entries(identifierValues)?.filter(([_k, value]) => !!value),
      ([key, value]) => (
        <KeyValue
          label={<FormattedMessage id={`ui-agreements.eresources.identifiers.${key}`} />}
          value={value.value}
        />
      )
    )
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
