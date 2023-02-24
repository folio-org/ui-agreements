import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  IconButton,
  Select,
  Row,
  Headline,
} from '@folio/stripes/components';
import { requiredValidator } from '@folio/stripes-erm-components';

import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

const ContentTypesFieldArray = ({
  fields: { name }
}) => {
  const { items, onAddField, onDeleteField } = useKiwtFieldArray(name);
  const renderContentTypes = () => {
    return items.map((act, index) => (
      <div
        key={act + index}
        data-testid={`contentTypesFieldArray[${index}]`}
      >
        <Row>
          <Col xs={3}>
            <Field
              component={Select}
              id={`${name}-${index}-name`}
              name={`${name}[${index}].name`}
              validate={requiredValidator}
            />
          </Col>
          <Col xs={9}>
            <IconButton
              ariaLabel={`remove-content-types[${index}]-${act.name}`}
              data-test-delete-field-button
              icon="trash"
              onClick={() => onDeleteField(index, act)}
            />
          </Col>
        </Row>
      </div>
    ));
  };

  return (
    <div>
      <Headline>
        <FormattedMessage id="ui-agreements.agreements.agreementContentType" />
      </Headline>
      <div
        data-test-content-types-field-array
        id="content-types-form"
      >
        {renderContentTypes()}
      </div>
      <Button
        data-test-content-types-field-array-add-button
        id="add-content-type-button"
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-agreements.agreements.addAgreementContentType" />
      </Button>
    </div>
  );
};

ContentTypesFieldArray.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ContentTypesFieldArray;

