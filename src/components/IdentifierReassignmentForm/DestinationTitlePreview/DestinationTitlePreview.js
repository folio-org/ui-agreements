import { FormattedMessage } from 'react-intl';
import { useFormState } from 'react-final-form';
import { Link } from 'react-router-dom';

import { AppIcon } from '@folio/stripes/core';

import {
  Card,
  KeyValue,
  Row,
  Col,
  Headline,
} from '@folio/stripes/components';

import { NewBox } from '@folio/stripes-erm-components';

import css from '../../styles.css';
import { filterIgnoreObjectKeys, urls } from '../../utilities';

const DestinationTitlePreview = () => {
  const { values } = useFormState();
  const destinationTI = values?.destinationTIObject;

  const renderTitleIds = (title) => {
    const validIdentifiers = title?.identifiers?.filter(tiId => tiId?.status?.value === 'approved');

    if (title?.id === values?.destinationTitle) {
      // Construct a new object which ignores the non-relevant keys
      const filteredValues = filterIgnoreObjectKeys(
        values,
        ['sourceTIObject', 'destinationTIObject', 'destinationTitle']
      );

      Object.values(filteredValues)?.forEach(value => {
        // This is an object containing identifiers from a source object
        /*
          * Shape:
          {
            issn: ['2092-6731', '8237-3432'],
            ezb: ['34567']
          }
          */
        /* istanbul ignore next */
        for (const [nsKey, idVals = []] of Object.entries(value)) {
          idVals.forEach(idVal => {
            if (idVal) {
              validIdentifiers.push({
                identifier: {
                  ns: {
                    value: nsKey
                  },
                  value: idVal,
                  isNew: true // Track the newly added ids
                }
              });
            }
          });
        }
      });
    }

    return (
      <Row>
        <Col md={6} xs={12}>
          <KeyValue label={<FormattedMessage id="ui-agreements.eresources.materialType" />}>{title?.subType?.label}</KeyValue>
        </Col>
        <Col key={`title-${title?.id}-identifier`} md={6} xs={12}>
          {validIdentifiers?.map((vi, index) => {
            return (
              <KeyValue
                key={`title-${title?.id}-identifier[${index}]`}
                label={vi?.identifier?.ns?.value}
              >
                {vi?.identifier?.value}
                {vi?.identifier?.isNew ?
                  <NewBox /> :
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
        {renderTitleIds(destinationTI)}
        {destinationTI?.relatedTitles?.map(rt => (
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
      data-testid="destination-title-identifier-preview"
      headerStart={(
        <AppIcon app="agreements" iconKey="eresource" size="small">
          <strong>
            <>
              <Link to={urls.titleView(destinationTI?.id)}>
                {destinationTI?.name}
              </Link>
              <> · {destinationTI?.publicationType?.label}</>
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

export default DestinationTitlePreview;
