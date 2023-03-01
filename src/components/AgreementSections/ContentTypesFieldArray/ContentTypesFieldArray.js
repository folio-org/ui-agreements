import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
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

// custom hook that holds any required value (props/state) from  the previous render cycle via a ref.
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// Utility function to check if two arrays of scalars contain the same items (Order does not count)
const arraysAreEqual = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every(element => {
    return b.includes(element);
  });
};

const [
  AGREEMENT_CONTENT_TYPE
] = [
  'SubscriptionAgreement.ContentType',
];

const ContentTypesFieldArray = ({
  fields: { name },
}) => {
  const refdata = useAgreementsRefdata({
    desc: [
      AGREEMENT_CONTENT_TYPE,
    ]
  });
  const contentTypeValues = getRefdataValuesByDesc(refdata, AGREEMENT_CONTENT_TYPE);
  const agreementContentType = contentTypeValues.map(ct => ({ value: ct.value, label: ct.label }));
  const { items, onAddField, onDeleteField } = useKiwtFieldArray(name);
  const [contentTypeInUse, setContentTypeInUse] = useState([]);
  const contentTypeRefs = useRef([]);
  contentTypeRefs.current = [];

  const itemsLength = items.length;
  const previousCount = usePrevious(itemsLength);

  useEffect(() => {
    const newContentTypeInUse = items.map(i => i?.contentType?.value).filter(x => !!x);
    if (!arraysAreEqual(contentTypeInUse, newContentTypeInUse)) {
      setContentTypeInUse(newContentTypeInUse);
    }
  }, [items, contentTypeInUse]);

  useEffect(() => {
    // the second conditional is checking if the current field to be focused is the default content type field.
    if (contentTypeRefs.current.length > 1 || (contentTypeRefs.current.length > 0 && previousCount - itemsLength === 1)) {
      contentTypeRefs.current[itemsLength - 1].focus();
    }
  }, [previousCount, itemsLength]);

  // callback ref that adds the individual ref to a field into the contentTypeRefs array
  const addToRefs = (node) => {
    if (node && !contentTypeRefs.current.includes(node)) {
      contentTypeRefs.current.push(node);
    }
  };

  const renderContentTypes = () => (
    items.map((act, index) => {
      const dataOptions = agreementContentType.filter(ct => !contentTypeInUse.includes(ct.value) || ct.value === act.contentType?.value);
      return (
        <div
          key={act + index}
          data-testid={`contentTypesFieldArray[${index}]`}
        >
          <Row>
            <Col xs={11}>
              <Field
                component={Select}
                dataOptions={dataOptions}
                id="content-type-field-array"
                index={index}
                inputRef={addToRefs}
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
      );
    })
  );

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

