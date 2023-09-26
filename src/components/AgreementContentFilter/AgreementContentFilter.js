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

import { deparseKiwtQueryFilters, parseKiwtQueryFilters } from '@k-int/stripes-kint-components';

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
  // TODO make this a constant and map ids to intl.formatMessage in component
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
  const parseQueryString = (filterArray) => {
    // Returns structured filter groups
    const parsedFilters = parseKiwtQueryFilters(filterArray[0]);

    const filters = parsedFilters.reduce((acc, curr, index) => {
      if (index === 0) {
        // Special case for the first one
        return [...acc, {
          // All filters in each group should have the same comparator by design
          attribute: curr[0]?.comparator,
          content: mapContentLabels(curr.filter(c => typeof c !== 'string')?.map(c => c.path))
        }];
      } else if (index % 2 === 0) { // Even indices are the groups
        return [...acc, {
          grouping: parsedFilters[index - 1],
          // All filters in each group should have the same comparator by design
          attribute: curr[0]?.comparator,
          content: mapContentLabels(curr.filter(c => typeof c !== 'string')?.map(c => c.path))
        }];
      }

      // For odd indicies, keep acc as it is
      return acc;
    }, []);

    return filters;
  };

  const updateFilters = (values) => {
    const kiwtQueryFilterShape = values?.agreementContent?.reduce((acc, curr) => {
      let newAcc = [];
      // Rebuild to shape expected by deparseKiwtQueryFilters
      if (!curr.content || !curr.attribute) {
        return acc;
      }

      // First glue in any boolean logic
      if (curr.grouping) {
        newAcc = [...acc, curr.grouping];
      }

      // Then translate group into filters
      newAcc = [
        ...newAcc,
        curr.content.reduce((a, c, i) => {
          return [
            ...a,
            i !== 0 ? '||' : null, // Don't group on first entry
            {
              path: c.value,
              comparator: curr.attribute
            }
          ].filter(Boolean);
        }, [])
      ];

      return newAcc;
    }, []);

    filterHandlers.state({
      ...activeFilters,
      agreementContent: [deparseKiwtQueryFilters(kiwtQueryFilterShape)],
    });
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
