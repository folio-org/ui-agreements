import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import {
  Accordion,
  Col,
  Icon,
  MultiColumnList,
  Row,
} from '@folio/stripes/components';


class EResourceAgreements extends React.Component {
  static manifest = Object.freeze({
    agreements: {
      type: 'okapi',
      path: 'erm/sas/%{agreementToFetch}',
      fetch: false,
      accumulate: true,
    },
    agreementToFetch: { initialValue: '' },
  })

  static propTypes = {
    eresource: PropTypes.object,
    id: PropTypes.string,
    mutator: PropTypes.shape({
      agreements: PropTypes.object,
      agreementToFetch: PropTypes.object
    }),
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    resources: PropTypes.shape({
      agreements: PropTypes.object,
      agreementToFetch: PropTypes.string
    }),
    stripes: PropTypes.object,
  };

  componentDidMount() {
    const { mutator, eresource: { entitlements } } = this.props;

    mutator.agreements.reset();

    if (!entitlements || !entitlements.length) return;

    entitlements.forEach((entitlement) => {
      mutator.agreementToFetch.replace(entitlement.owner.id);
      mutator.agreements.GET();
    });
  }

  render() {
    const { resources: { agreements }, stripes: { intl } } = this.props;

    if (!agreements || !agreements.records) {
      return <Icon icon="spinner-ellipsis" width="100px" />;
    }

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-erm.eresources.erInfo' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={agreements.records}
              maxHeight={400}
              visibleColumns={['name', 'type']}
              formatter={{
                name: agreement => <Link to={`/erm/agreements/view/${agreement.id}`}>{agreement.name}</Link>,
                type: agreement => agreement.agreementStatus && agreement.agreementStatus.label,
              }}
              columnMapping={{
                name: intl.formatMessage({ id: 'ui-erm.eresources.erAgreements' }),
                type: intl.formatMessage({ id: 'ui-erm.eresources.agreementStatus' }),
              }}
              columnWidths={{
                name: '60%',
                type: '40%',
              }}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default EResourceAgreements;
