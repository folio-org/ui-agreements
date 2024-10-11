import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import arrayMutators from 'final-form-arrays';
import { FormModal } from '@k-int/stripes-kint-components';
import { FormattedMessage } from 'react-intl';
import DocumentFilterFieldArray from '../DocumentFilterFieldArray';

const DocumentFilterForm = ({
  atTypeValues,
  editingFilters,
  filters,
  handlers: { openEditModal, closeEditModal },
  onSubmit,
}) => {
  const filterBuilder = atTypeValues.length > 0 ? 'documentFilterBuilder' : '';
  return (
    <>
      <Button onClick={openEditModal}>
        <FormattedMessage id="ui-agreements.documentFilter.editDocumentFilters" />
      </Button>
      <FormModal
        initialValues={{
          filters: filters?.length ? filters : [{ rules: [{}] }],
        }}
        modalProps={{
          dismissible: true,
          enforceFocus: false,
          label: (
            <FormattedMessage id={`ui-agreements.documentFilter.${filterBuilder}`} />
          ),
          onClose: closeEditModal,
          open: editingFilters,
          size: 'medium',
        }}
        mutators={{ ...arrayMutators }}
        onSubmit={onSubmit}
      >
        <DocumentFilterFieldArray atTypeValues={atTypeValues} />
      </FormModal>
    </>
  );
};

DocumentFilterForm.propTypes = {
  atTypeValues: PropTypes.arrayOf(PropTypes.object),
  editingFilters: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.object),
  handlers: PropTypes.shape({
    closeEditModal: PropTypes.func.isRequired,
    openEditModal: PropTypes.func.isRequired,
  }),
  onSubmit: PropTypes.func,
};
export default DocumentFilterForm;
