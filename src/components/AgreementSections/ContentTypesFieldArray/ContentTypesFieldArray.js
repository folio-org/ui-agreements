import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { getRefdataValuesByDesc, requiredValidator } from '@folio/stripes-erm-components';
import {
  Button,
  Col,
  IconButton,
  Select,
  Row,
  Headline,
} from '@folio/stripes/components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';
import { useAgreementsRefdata } from '../../../hooks';


const [
  AGREEMENT_CONTENT_TYPE
] = [
  'SubscriptionAgreement.ContentType',
];

const ContentTypesFieldArray = ({
  fields: { name }
}) => {
  const refdata = useAgreementsRefdata({
    desc: [
      AGREEMENT_CONTENT_TYPE,
    ]
  });
  const contentTypeValues = getRefdataValuesByDesc(refdata, AGREEMENT_CONTENT_TYPE);
  const { items, onAddField, onDeleteField } = useKiwtFieldArray(name);

  const renderContentTypes = () => {
    return items.map((act, index) => (
      <div
        key={act + index}
        data-testid={`contentTypesFieldArray[${index}]`}
      >
        <Row>
          <Col xs={11}>
            <Field
              component={Select}
              dataOptions={contentTypeValues}
              id="content-type-field-array"
              name={`${name}[${index}].contentType.value`}
              placeholder=" "
              validate={requiredValidator}
            />
          </Col>
          <Col xs={1}>
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
  })
};

export default ContentTypesFieldArray;

