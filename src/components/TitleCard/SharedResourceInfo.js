import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { EResourceType } from '@folio/stripes-erm-components';

const propTypes = {
  titleInstance: PropTypes.shape({
    subType: PropTypes.shape({
      label: PropTypes.string,
    }),
    work: PropTypes.shape({
      sourceIdentifier: PropTypes.shape({
        identifier: PropTypes.shape({
          value: PropTypes.string,
          ns: PropTypes.shape({
            value: PropTypes.string,
          }),
        }),
      }),
    }),
  }).isRequired,
};

const SharedResourceInfo = ({
  titleInstance
}) => (
  <>
    <Row>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.publicationType" />}>
          <div data-test-title-instance-publication-type>
            <EResourceType resource={titleInstance} />
          </div>
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
          <div data-test-title-instance-sub-type>{titleInstance.subType?.label ?? <NoValue />}</div>
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.workIdentifier" />}>
          <div data-test-title-instance-work-identifier>{titleInstance.work?.sourceIdentifier?.identifier?.value ?? <NoValue />}</div>
        </KeyValue>
      </Col>
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id="ui-agreements.eresources.workIdentifierType" />}>
          <div data-test-title-instance-work-identifier>{titleInstance.work?.sourceIdentifier?.identifier?.ns?.value ?? <NoValue />}</div>
        </KeyValue>
      </Col>
    </Row>
  </>
);

SharedResourceInfo.propTypes = propTypes;
export default SharedResourceInfo;
