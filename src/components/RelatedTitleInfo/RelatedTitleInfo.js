import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { AppIcon } from '@folio/stripes/core';
import {
  Col,
  Headline,
  InfoPopover,
  KeyValue,
  NoValue,
  Row,
  TextLink
} from '@folio/stripes/components';

import { resourceTypes } from '../../constants';
import EResourceIdentifier from '../EResourceIdentifier';
import css from '../styles.css';

const propTypes = {
  relatedTitle: PropTypes.shape({
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
  }).isRequired,
  showLink: PropTypes.bool,
};

const RelatedTitleInfo = ({
  relatedTitle,
  showLink = false
}) => {
  const { location: { search: searchString } } = useHistory();

  const renderElectronicLink = () => {
    const relatedTitleLink = `${relatedTitle.id}${searchString}`;
    return (
      <Row>
        <Col xs={12}>
          <AppIcon
            app="agreements"
            iconAlignment="baseline"
            iconKey="title"
            size="small"
          >
            <TextLink to={relatedTitleLink}><FormattedMessage id="ui-agreements.eresources.electronicTitle" values={{ name: relatedTitle.name }} /></TextLink>
            <InfoPopover
              content={<FormattedMessage id="ui-agreements.eresources.relatedTitle.infoPopover" />}
            />
          </AppIcon>
        </Col>
      </Row>
    );
  };

  return (
    <div data-test-related-titles>
      <div className={css.separator} />
      <Headline data-test-title-instance-name size="large" tag="h3">
        <FormattedMessage id="ui-agreements.eresources.relatedTitle" values={{ name: relatedTitle.name }} />
      </Headline>
      <Row>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>
            <div data-test-title-instance-sub-type>{relatedTitle.subType?.label ?? <NoValue />}</div>
          </KeyValue>
        </Col>
        {relatedTitle.type.value === resourceTypes.MONOGRAPH || relatedTitle.type.value === resourceTypes.BOOK ?
          <>
            <EResourceIdentifier titleInstance={relatedTitle} type="isbn" />
            <EResourceIdentifier titleInstance={relatedTitle} type="doi" />
          </>
          :
          <>
            <EResourceIdentifier titleInstance={relatedTitle} type="ezb" />
            <EResourceIdentifier titleInstance={relatedTitle} type="zdb" />
            <EResourceIdentifier titleInstance={relatedTitle} type="eissn" />
            <EResourceIdentifier titleInstance={relatedTitle} type="pissn" />
            <EResourceIdentifier titleInstance={relatedTitle} type="issn" />
          </>
        }
      </Row>
      {showLink && renderElectronicLink()}
    </div>
  );
};

RelatedTitleInfo.propTypes = propTypes;
export default RelatedTitleInfo;
