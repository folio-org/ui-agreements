import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import { resourceTypes } from '../../constants';
import EResourceIdentifier from '../EResourceIdentifier';
import css from './RelatedTitle.css';

const propTypes = {
  relatedTitles: PropTypes.arrayOf(PropTypes.shape({
    titleInstance: PropTypes.shape({
      id: PropTypes.string,
      identifiers: PropTypes.arrayOf(PropTypes.shape({
        identifier: PropTypes.shape({
          ns: PropTypes.shape({
            value: PropTypes.string,
          }),
          value: PropTypes.string,
        }),
      })),
      longName: PropTypes.string,
      name: PropTypes.string,
      subType: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
      }),
      type: PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        value: PropTypes.string,
      }),
    }),
  })).isRequired,
};

const RelatedTitleInfo = ({
  relatedTitles
}) => (
  relatedTitles.map((titleInstance) => (
    <>
      <div className={css.separator} />
      <Headline size="large" tag="h3">
        <FormattedMessage id="ui-agreements.eresources.relatedTitle" values={{ name: titleInstance.name }} />
      </Headline>
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
            <div data-test-title-instance-sub-type>{titleInstance.subType?.label ?? <NoValue />}</div>
          </KeyValue>
        </Col>
        {titleInstance.type.value === resourceTypes.MONOGRAPH || titleInstance.type.value === resourceTypes.BOOK ?
          <>
            <EResourceIdentifier titleInstance={titleInstance} type="isbn" />
            <EResourceIdentifier titleInstance={titleInstance} type="doi" />
          </>
          :
          <>
            <EResourceIdentifier titleInstance={titleInstance} type="ezb" />
            <EResourceIdentifier titleInstance={titleInstance} type="zdb" />
            <EResourceIdentifier titleInstance={titleInstance} type="eissn" />
            <EResourceIdentifier titleInstance={titleInstance} type="issn" />
          </>
        }
      </Row>
    </>
  ))
);

RelatedTitleInfo.propTypes = propTypes;
export default RelatedTitleInfo;
