import PropTypes from 'prop-types';
import { Row } from '@folio/stripes/components';

import EResourceIdentifier from '../EResourceIdentifier';
import SharedResourceInfo from './SharedResourceInfo';

const propTypes = {
  titleInstance: PropTypes.shape({
    subType: PropTypes.shape({
      label: PropTypes.string,
    }),
  }).isRequired,
};

const SerialResourceInfo = ({
  titleInstance
}) => (
  <>
    <SharedResourceInfo titleInstance={titleInstance} />
    <Row>
      <EResourceIdentifier titleInstance={titleInstance} type="ezb" />
      <EResourceIdentifier titleInstance={titleInstance} type="zdb" />
      <EResourceIdentifier titleInstance={titleInstance} type="eissn" />
      <EResourceIdentifier titleInstance={titleInstance} type="pissn" />
      <EResourceIdentifier titleInstance={titleInstance} type="issn" />
    </Row>
  </>
);

SerialResourceInfo.propTypes = propTypes;
export default SerialResourceInfo;
