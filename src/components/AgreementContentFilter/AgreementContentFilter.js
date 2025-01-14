import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { useIntl } from 'react-intl';

import {
  deparseKiwtQueryFilters,
  parseKiwtQueryFilters,
} from '@k-int/stripes-kint-components';
import { DocumentFilterArray } from '@folio/stripes-erm-components';

import { agreementContentOptions } from '../../constants';

const AgreementContentFieldArray = ({ handleSubmit }) => {
  const intl = useIntl();
  const translatedContentOptions = agreementContentOptions.map((e) => {
    return { value: e?.value, label: intl.formatMessage({ id: e?.id }) };
  });

  return (
    <DocumentFilterArray
      handleSubmit={handleSubmit}
      name="agreementContent"
      translatedContentOptions={translatedContentOptions}
    />
  );
};

const AgreementContentFilter = ({
  agreementContentFilters,
  filterHandlers,
  activeFilters,
}) => {
  const intl = useIntl();
  const translatedContentOptions = agreementContentOptions.map((e) => {
    return { value: e?.value, label: intl.formatMessage({ id: e?.id }) };
  });
  // Used to map labels to content values for use within the multiselection
  const mapContentLabels = (contentArray) => {
    // Track whether 'relatedAgreements' has been added to the result
    let relatedAgreementsAdded = false;
    // Format content array so that inward/outwardRelationship values are replace with a single relatedAgreements value
    const formattedArray = contentArray
      .map((value) => {
        if (
          (value === 'inwardRelationships' ||
            value === 'outwardRelationships') &&
          !relatedAgreementsAdded
        ) {
          relatedAgreementsAdded = true;
          return 'relatedAgreements';
        }
        return value !== 'inwardRelationships' &&
          value !== 'outwardRelationships'
          ? value
          : undefined;
      })
      .filter((value) => value !== undefined);

    return formattedArray.map((content) => {
      return {
        value: content,
        label: translatedContentOptions?.find((e) => e?.value === content)
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
        return [
          ...acc,
          {
            // All filters in each group should have the same comparator by design
            attribute: curr[0]?.comparator,
            content: mapContentLabels(
              curr.filter((c) => typeof c !== 'string')?.map((c) => c.path)
            ),
          },
        ];
      } else if (index % 2 === 0) {
        // Even indices are the groups
        return [
          ...acc,
          {
            grouping: parsedFilters[index - 1],
            // All filters in each group should have the same comparator by design
            attribute: curr[0]?.comparator,
            content: mapContentLabels(
              curr.filter((c) => typeof c !== 'string')?.map((c) => c.path)
            ),
          },
        ];
      }

      // For odd indicies, keep acc as it is
      return acc;
    }, []);

    return filters;
  };

  const updateFilters = (values) => {
    const kiwtQueryFilterShape = values?.agreementContent?.reduce(
      (acc, curr) => {
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
            // Special case for if relatedAgreements is selected
            // It is then seperated out into its inward and outward relationship components
            // If the attribute is "Has not" then both inward and outward relationships are expected to be empty
            if (c?.value === 'relatedAgreements') {
              return [
                ...a,
                i !== 0 ? '||' : null, // Don't group on first entry
                {
                  path: 'inwardRelationships',
                  comparator: curr.attribute,
                },
                curr.attribute === ' isEmpty' ? '&&' : '||',
                {
                  path: 'outwardRelationships',
                  comparator: curr.attribute,
                },
              ].filter(Boolean);
            }
            return [
              ...a,
              i !== 0 ? '||' : null, // Don't group on first entry
              {
                path: c.value,
                comparator: curr.attribute,
              },
            ].filter(Boolean);
          }, []),
        ];

        return newAcc;
      },
      []
    );

    const validateFilter = (filter) => {
      return filter?.attribute && filter?.content?.length;
    };

    if (values?.agreementContent?.every(validateFilter)) {
      filterHandlers.state({
        ...activeFilters,
        // FIXME this isn't ideal, KIWT should accept spaces in query -- Ask Steve
        agreementContent: [
          deparseKiwtQueryFilters(kiwtQueryFilterShape)
        ],
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
  filterHandlers: PropTypes.object,
  activeFilters: PropTypes.object,
};

export default AgreementContentFilter;
