import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button, Icon } from '@folio/stripes/components';

const propTypes = {
  url: PropTypes.string.isRequired,
  remoteKbName: PropTypes.string.isRequired,
};

const ViewInRemoteKbButton = ({ url, remoteKbName }) => {
  return (
    <Button allowAnchorClick buttonStyle="dropdownItem" href={url}>
      <Icon icon="external-link">
        <FormattedMessage id="ui-agreements.remoteKb.actions.viewInRemoteKb" values={{ remoteKbName }} />
      </Icon>
    </Button>
  );
};

ViewInRemoteKbButton.propTypes = propTypes;

export default ViewInRemoteKbButton;
