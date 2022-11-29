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

    // Crawl through all valid identifiers and filter out any that appear in the form values to be moved
    const identifiersToMove = values[title?.id] ?? {};

    identifiers.push(
      ...(validIdentifiers ?? [])?.filter(vId => (
        // Include all valid Identifiers where the namespace doesn't show up in the list of ids to move
        !Object.keys(identifiersToMove)?.includes(vId.identifier?.ns?.value) ||
        // Include all valid identifiers where the value isn't in the list to move
        !identifiersToMove[vId.identifier?.ns?.value]?.includes(vId.identifier?.value)
      ))
    );

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
              <Link to={urls.titleView(sourceTI?.id)}>
                {sourceTI?.name}
              </Link>
              <> · {sourceTI?.publicationType?.label}</>
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
