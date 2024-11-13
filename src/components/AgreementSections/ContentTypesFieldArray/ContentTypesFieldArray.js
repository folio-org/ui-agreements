import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import isEqual from 'lodash/isEqual';

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
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import { getRefdataValuesByDesc, requiredValidator, usePrevious } from '@folio/stripes-erm-components';

import { useAgreementsRefdata } from '../../../hooks';

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
  const contentTypeSelectOptions = getRefdataValuesByDesc(refdata, AGREEMENT_CONTENT_TYPE)
    .map(ct => ({
      value: ct.id, // Map to id for submittal purposes
      label: ct.label
    }));

  const { items, onAddField, onDeleteField } = useKiwtFieldArray(name);
  const [contentTypeInUse, setContentTypeInUse] = useState([]);
  const contentTypeRefs = useRef([]);
  contentTypeRefs.current = [];

  const itemsLength = items.length;
  const previousCount = usePrevious(itemsLength);

  useEffect(() => {
    const newContentTypeInUse = items.map(i => i?.contentType?.id).filter(x => !!x);
    if (!isEqual(contentTypeInUse, newContentTypeInUse)) {
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
      const dataOptions = contentTypeSelectOptions.filter(ct => !contentTypeInUse.includes(ct.value) || ct.value === act.contentType?.id);

      return (
        <div
          key={`${act?.contentType?.id}`}
          data-testid={`contentTypesFieldArray[${index}]`}
        >
          <Row>
            <Col xs={11}>
              {/*
                * This select will ONLY change the id of the refdata,
                * and the bind will happen from that. That will make
                * the PUT look a little funky as it will have the old
                * label/value information, but prevents us from having
                * to do loads of eaxtra tweaking at the field level
                */}
              <Field
                component={Select}
                dataOptions={dataOptions}
                id="content-type-field-array"
                index={index}
                inputRef={addToRefs}
                name={`${name}[${index}].contentType.id`}
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

