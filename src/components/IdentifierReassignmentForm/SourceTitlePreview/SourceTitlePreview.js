import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';
import { Link } from 'react-router-dom';

import {
  Card,
  KeyValue,
  Row,
  Col,
  Headline,
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';
import css from '../../styles.css';
import { urls } from '../../utilities';

const SourceTitlePreview = () => {
  const { values } = useFormState();
  const sourceTI = values?.sourceTIObject;

  const renderTitleIds = (title) => {
    const validIdentifiers = title?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');

    const identifiers = [];
    // Crawl through ids to be moved and look for any for this title
    for (const [key, value] of Object.entries(values)) {
      if (key === title?.id) {
        // This is an object of shape
        /*
          {
            issn: ['2092-6731', '8237-3432'],
            ezb: ['34567', undefined]
          }
        */
        /* istanbul ignore next */
        for (const [nsKey, idVals] of Object.entries(value)) {
          identifiers.push(
            ...validIdentifiers?.filter(vId => vId.identifier?.ns?.value === nsKey && !idVals.includes(vId.identifier.value))
          );
        }
      }
    }

    return (
      <Row>
        <Col md={6} xs={12}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>{title?.subType?.label}</KeyValue>
        </Col>
        <Col md={6} xs={12}>
          {identifiers?.map((vi, index) => {
            return (
              <KeyValue
                key={`title-${title?.id}-identifier[${index}]`}
                label={vi?.identifier?.ns?.value}
              >
                {vi?.identifier?.value}
                {vi?.identifier?.isNew ?
                  <span className={css.newBox}>
                    <FormattedMessage id="ui-agreements.new" />
                  </span> :
                  null
                }
              </KeyValue>
            );
          })}
        </Col>
      </Row>
    );
  };

  const renderPreviewTitle = () => {
    return (
      <>
        <Headline size="large" tag="h3">
          <FormattedMessage id="ui-agreements.identifiers.identifierDestination" />
        </Headline>
        {renderTitleIds(sourceTI)}
        {sourceTI?.relatedTitles?.map(rt => (
          <>
            <div className={css.separator} />
            {renderTitleIds(rt)}
          </>
        ))}
      </>
    );
  };

  return (
    <Card
      cardStyle="positive"
      data-testid="source-title-identifier-preview"
      headerStart={(
        <AppIcon app="agreements" iconKey="eresource" size="small">
          <strong>
            <>
              <Link to={urls.eresourceView(sourceTI?.id)}>
                {sourceTI?.name}
              </Link>
              {/* TODO not sure about this formatting */}
              <> . {sourceTI?.publicationType?.label}</>
            </>
          </strong>
        </AppIcon>
      )}
      roundedBorder
    >
      {renderPreviewTitle()}
    </Card>
  );
};

export default SourceTitlePreview;
