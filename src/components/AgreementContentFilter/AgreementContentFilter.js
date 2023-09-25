import PropTypes from 'prop-types';
import { Form, Field, useForm, useFormState } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Dropdown,
  DropdownMenu,
  MultiSelection,
  Select,
  Button,
  Label,
  IconButton,
  Row,
  Col,
} from '@folio/stripes/components';

import { useAgreementContentOptions } from '../../hooks';

const AgreementContentFieldArray = ({ handleSubmit }) => {
  const intl = useIntl();
  const agreementContentOptions = useAgreementContentOptions();
  const { values } = useFormState();
  const { change } = useForm();

  return (
    <FieldArray name="agreementContent">
      {({ fields }) => (
        <>
          {fields?.map((filter, index) => {
            return (
              <>
                {values?.agreementContent[index]?.grouping === '&&' && (
                  <Label>
                    <FormattedMessage id="ui-agreements.AND" />
                  </Label>
                )}
                {values?.agreementContent[index]?.grouping === '||' && (
                  <Label>
                    <FormattedMessage id="ui-agreements.OR" />
                  </Label>
                )}
                <Row xs="end">
                  <Col xs={10}>
                    <Field
                      component={Select}
                      dataOptions={[
                        { value: '', label: '' },
                        {
                          value: 'isNotEmpty',
                          label: intl.formatMessage({
                            id: 'ui-agreements.agreementContent.filter.has',
                          }),
                        },
                        {
                          value: 'isEmpty',
                          label: intl.formatMessage({
                            id: 'ui-agreements.agreementContent.filter.hasNot',
                          }),
                        },
                      ]}
                      name={`${filter}.attribute`}
                      onChange={(e) => {
                        change(`${filter}.attribute`, e?.target?.value);
                        handleSubmit();
                      }}
                    />
                    <Field
                      component={MultiSelection}
                      dataOptions={agreementContentOptions}
                      name={`${filter}.content`}
                      onChange={(e) => {
                        change(`${filter}.content`, e);
                        handleSubmit();
                      }}
                    />
                  </Col>
                  {index !== 0 && (
                    <Col>
                      <IconButton
                        icon="times-circle-solid"
                        onClick={() => {
                          fields.remove(index);
                          handleSubmit();
                        }}
                      />
                    </Col>
                  )}
                </Row>
              </>
            );
          })}
          <Dropdown
            label={
              <FormattedMessage id="ui-agreements.agreementContent.filter.addFilter" />
            }
          >
            <DropdownMenu>
              <Button
                buttonStyle="dropdownItem"
                onClick={() => fields.push({ grouping: '&&' })}
              >
                <FormattedMessage id="ui-agreements.AND" />
              </Button>
              <Button
                buttonStyle="dropdownItem"
                onClick={() => fields.push({ grouping: '||' })}
              >
                <FormattedMessage id="ui-agreements.OR" />
              </Button>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
    </FieldArray>
  );
};

const AgreementContentFilter = ({
  agreementContentFilters,
  filterHandlers,
  activeFilters,
}) => {
  const agreementContentOptions = useAgreementContentOptions();

  // Used to map labels to content values for use within the multiselection
  const mapContentLabels = (contentArray) => {
    return contentArray.map((content) => {
      return {
        value: content,
        label: agreementContentOptions?.find((e) => e?.value === content)
          ?.label,
      };
    });
  };

  // Used to parse filters back from query string
  // FIXME This can almost certainly do with some tidying up
  const parseQueryString = (filterArray) => {
    const filters = [];
    const isNotEmptyRegexp = /(?: isNotEmpty\|\|)|(?: isNotEmpty)/g;
    const isEmptyRegexp = /(?: isEmpty\|\|)|(?: isEmpty)/g;

    // Split in subsequent groups based on closing parentheses
    // (orgs isEmpty)&&(items isNotEmpty) => [(orgs isEmpty), &&(items isNotEmpty)]
    const filterGroups = filterArray[0]?.match(/.+?([)])/g);
    filterGroups?.forEach((filter) => {
      // Split each of the previous array elements into values contained within brackets
      // &&(items isNotEmpty) => [&&, items isNotEmpty]
      const splitFilter = filter?.split(/[()]+/).filter((e) => e !== '');
      // If the array of filters is > 1 then a grouping value must be present
      if (splitFilter?.length > 1) {
        filters.push({
          grouping: splitFilter[0],
          attribute: splitFilter[1].includes('isEmpty')
            ? 'isEmpty'
            : 'isNotEmpty',
          content: mapContentLabels(
            splitFilter[1]
              .split(
                splitFilter[1].includes('isEmpty')
                  ? isEmptyRegexp
                  : isNotEmptyRegexp
              )
              .filter((e) => e !== '')
          ),
        });
      // Otherwise its the first filter with no grouping element
      } else {
        filters.push({
          attribute: splitFilter[0].includes('isEmpty')
            ? 'isEmpty'
            : 'isNotEmpty',
          content: mapContentLabels(
            splitFilter[0]
              .split(
                splitFilter[0].includes('isEmpty')
                  ? isEmptyRegexp
                  : isNotEmptyRegexp
              )
              .filter((e) => e !== '')
          ),
        });
      }
    });
    return filters;
  };

  const validateFilter = (filter) => {
    return filter?.attribute && filter?.content?.length;
  };

  const updateFilters = (values) => {
    if (values?.agreementContent?.every(validateFilter)) {
      const filterStrings = values?.agreementContent.map((filter) => {
        const contentStrings = filter?.content?.map((content) => {
          return `${content?.value} ${filter?.attribute}`;
        });
        return `${filter?.grouping || ''}(` + contentStrings?.join('||') + ')';
      });
      filterHandlers.state({
        ...activeFilters,
        agreementContent: [filterStrings.join('')],
      });
    }
  };

  return (
    <Form
      initialValues={{
        agreementContent: agreementContentFilters.length
          ? parseQueryString(agreementContentFilters)
          : [{}],
      }}
      mutators={arrayMutators}
      onSubmit={updateFilters}
    >
      {({ handleSubmit }) => (
        <form id="agreement-content-form" onSubmit={handleSubmit}>
          <AgreementContentFieldArray
            handleSubmit={handleSubmit}
            name="agreementContent"
          />
        </form>
      )}
    </Form>
  );
};

AgreementContentFieldArray.propTypes = {
  handleSubmit: PropTypes.func,
};

AgreementContentFilter.propTypes = {
  agreementContentFilters: PropTypes.arrayOf(PropTypes.object),
  filterHandlers: PropTypes.arrayOf(PropTypes.object),
  activeFilters: PropTypes.arrayOf(PropTypes.object),
};

export default AgreementContentFilter;
