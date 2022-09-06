import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Headline,
  KeyValue,
  Layout,
  Row,
  NoValue,
  List,
} from '@folio/stripes/components';

import { FormattedDateTime } from '@folio/stripes-erm-components';
import { resourceClasses } from '../../../constants';

import AddToBasketButton from '../../AddToBasketButton';
import PackageIdentifiers from '../PackageIdentifiers';

const PackageInfo = ({
  data: {
    eresource
  }
}) => {
  const renderContentTypes = (contentTypes) => (
    contentTypes.map(ct => {
      const { contentType: { label, value } } = ct;
      return (
        <li key={value}>
          {label}
        </li>
      );
    })
  );

  const entitlementOption = {
    class: resourceClasses.PACKAGE,
    id: eresource.id,
    name: eresource.name,
    _object: eresource,
  };

  return (
    <div id="package-info">
      <Row between="md">
        <Col md={8} xs={12}>
          <Headline
            size="xx-large"
            tag="h2"
          >
            {eresource.name}
          </Headline>
        </Col>
        <Col>
          <Layout className="marginTop1">
            <AddToBasketButton
              key={eresource.id}
              addLabel={<FormattedMessage id="ui-agreements.eresources.addPackageToBasket" />}
              buttonProps={{ 'data-test-add-package-to-basket': true }}
              item={entitlementOption}
              removeLabel={<FormattedMessage id="ui-agreements.eresources.removePackageFromBasket" />}
            />
          </Layout>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.provider" />}
            value={eresource?.vendor?.name || <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.source" />}
            value={eresource.source || <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.status" />}
            value={eresource?.lifecycleStatus?.label || <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.reference" />}
            value={eresource.reference || <NoValue />}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.contentType" />}
            value={eresource?.contentTypes?.length > 0 ? renderContentTypes(eresource.contentTypes) : <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.availability" />}
            subValue={eresource?.availabilityConstraints?.length > 0 ?
              <List
                id="availabilityConstraints"
                items={eresource?.availabilityConstraints?.map(ac => ac?.body?.label)}
                listStyle="bullets"
                marginBottom0
              />
              :
              null
}
            value={eresource?.availabilityScope?.label || <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.sourceCreated" />}
            value={eresource?.sourceDataCreated ? <FormattedDateTime date={eresource.sourceDataCreated} /> : <NoValue />}
          />
        </Col>
        <Col xs={3}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.eresources.sourceLastUpdated" />}
            value={eresource?.sourceDataUpdated ? <FormattedDateTime date={eresource.sourceDataUpdated} /> : <NoValue />}
          />
        </Col>
      </Row>
      <PackageIdentifiers pkg={eresource} />
    </div>
  );
};

PackageInfo.propTypes = {
  data: PropTypes.shape({
    eresource: PropTypes.shape({
      alternateResourceNames: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string
      })),
      availabilityConstraints:  PropTypes.arrayOf(PropTypes.shape({
        body: PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string,
          value: PropTypes.string
        }),
        id: PropTypes.string
      })),
      availabilityScope: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string
      }),
      contentTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        contentType: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        }),
      })),
      description: PropTypes.string,
      id: PropTypes.string,
      lifecycleStatus: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string
      }),
      name: PropTypes.string,
      packageDescriptionUrls: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        url: PropTypes.string
      })),
      reference: PropTypes.string,
      source: PropTypes.string,
      sourceDataCreated: PropTypes.string,
      sourceDataUpdated: PropTypes.string,
      vendor: PropTypes.shape({
        name: PropTypes.string,
      })
    })
  }).isRequired,
};

export default PackageInfo;
