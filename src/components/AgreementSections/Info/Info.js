import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Headline,
  KeyValue,
  MetaSection,
  MultiColumnList,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { statuses } from '../../../constants';
import InfoPeriods from '../InfoPeriods';

const Info = ({ agreement }) => {
  const renderContentTypes = (agreementContentTypes) => (
    agreementContentTypes.map((act, index) => {
      const { contentType: { label, value } } = act;
      return (
        <span key={value}>
          {label}
          {index < label.length -1 && '; '}
        </span>
        
      );
    })
  );

  return (
    <div data-test-agreement-info>
      <Row>
        <Col xs={12}>
          <div data-test-agreement-name>
            <Headline
              size="xx-large"
              tag="h2"
            >
              {agreement.name}
            </Headline>
          </div>
        </Col>
      </Row>
      <MetaSection
        contentId="agreementInfoRecordMetaContent"
        createdDate={agreement.dateCreated}
        hideSource
        id="agreementInfoRecordMeta"
        lastUpdatedDate={agreement.lastUpdated}
      />
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.isPerpetual" />}>
            <div data-test-agreement-is-perpetual>
              {agreement?.isPerpetual?.label ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.renewalPriority" />}>
            <div data-test-agreement-renewal-priority>
              {agreement?.renewalPriority?.label ?? <NoValue />}
            </div>
          </KeyValue>
        </Col>
        {agreement?.agreementStatus?.value === statuses.CLOSED &&
          <Col xs={3}>
            <KeyValue label={<FormattedMessage id="ui-agreements.agreements.reasonForClosure" />}>
              <div data-test-agreement-reason-for-closure>
                {agreement?.reasonForClosure?.label ?? <NoValue />}
              </div>
            </KeyValue>
          </Col>
        }
      </Row>
      <Row>
        <Col xs={8}>
          <KeyValue label={<FormattedMessage id="ui-agreements.agreements.agreementDescription" />}>
            <div data-test-agreement-description style={{ whiteSpace: 'pre-wrap' }}>
              {agreement.description || <NoValue />}
            </div>
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col xs={8}>
          <KeyValue
            label={<FormattedMessage id="ui-agreements.agreements.agreementContentType" />}
            value={agreement?.agreementContentTypes?.length > 0 ? renderContentTypes(agreement.agreementContentTypes) : <NoValue />}
          />
        </Col>
      </Row>
      {agreement?.licenseNote &&
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-agreements.license.generalNotes" />}>
              <div data-test-agreement-license-note style={{ whiteSpace: 'pre-wrap' }}>
                {agreement.licenseNote}
              </div>
            </KeyValue>
          </Col>
        </Row>
      }
      {agreement?.alternateNames?.length !== 0 &&
        <MultiColumnList
          columnMapping={{ name: <FormattedMessage id="ui-agreements.alternativeNames" /> }}
          contentData={agreement.alternateNames}
          id="alternate-names-list"
          visibleColumns={['name']}
        />
      }
      <InfoPeriods periods={agreement.periods} />
    </div>
  );
};

export default Info;

Info.propTypes = {
  agreement: PropTypes.shape({
    agreementStatus: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
    agreementContentTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      contentType: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      }),
    })),
    alternateNames: PropTypes.arrayOf(PropTypes.object),
    cancellationDeadline: PropTypes.string,
    currentPeriod: PropTypes.shape({
      note: PropTypes.string,
    }),
    dateCreated: PropTypes.string,
    description: PropTypes.string,
    isPerpetual: PropTypes.shape({
      label: PropTypes.string,
    }),
    lastUpdated: PropTypes.string,
    licenseNote: PropTypes.string,
    name: PropTypes.string,
    reasonForClosure: PropTypes.shape({
      label: PropTypes.string,
    }),
    periods: PropTypes.arrayOf(PropTypes.shape({
      cancellationDeadline: PropTypes.string,
      endDate: PropTypes.string,
      periodStatus: PropTypes.string,
      startDate: PropTypes.string.isRequired,
    })),
    renewalPriority: PropTypes.shape({
      label: PropTypes.string,
    }),
  }),
};
