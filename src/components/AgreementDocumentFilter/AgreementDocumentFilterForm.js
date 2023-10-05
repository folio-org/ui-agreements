import PropTypes from 'prop-types';
import { Button } from '@folio/stripes/components';
import arrayMutators from 'final-form-arrays';
import { FormModal } from '@k-int/stripes-kint-components';
import { FormattedMessage } from 'react-intl';
import AgreementDocumentFilterFieldArray from './AgreementDocumentFilterFieldArray';

const AgreementDocumentFilterForm = ({
  editingFilters,
  filters,
  handlers: { openEditModal, closeEditModal },
  onSubmit,
}) => {
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
          label: <FormattedMessage id="ui-agreements.documentFilter.documentFilterBuilder" />,
          onClose: closeEditModal,
          open: editingFilters,
          size: 'medium',
        }}
        mutators={{ ...arrayMutators }}
        onSubmit={onSubmit}
      >
        <AgreementDocumentFilterFieldArray />
      </FormModal>
    </>
  );
};

AgreementDocumentFilterForm.propTypes = {
  editingFilters: PropTypes.bool,
  filters: PropTypes.arrayOf(PropTypes.object),
  handlers: PropTypes.shape({
    closeEditModal: PropTypes.func.isRequired,
    openEditModal: PropTypes.func.isRequired,
  }),
  onSubmit: PropTypes.func,
};
export default AgreementDocumentFilterForm;
