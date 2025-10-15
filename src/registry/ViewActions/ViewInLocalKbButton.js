import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import { Button, Icon } from '@folio/stripes/components';

import { TITLES_ELECTRONIC_ENDPOINT } from '../../constants';

const propTypes = {
  remoteId: PropTypes.string.isRequired,
};

const ViewInLocalKbButton = ({ remoteId }) => {
  const ky = useOkapiKy();

  const {
    data: localEresourceId,
  } = useQuery(
    ['REMOTEKB', 'fetchLocalTitleId', remoteId],
    () => ky.get(`${TITLES_ELECTRONIC_ENDPOINT}?match=identifiers.identifier.value&term=${remoteId}`).json(),
    {
      enabled: !!remoteId,
      // for now only handle the first match
      // TODO: handle multiple TI found with same remote identifier
      select: (d) => d?.[0]?.id ?? null,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return (
    <Button buttonStyle="dropdownItem" disabled={!localEresourceId} to={localEresourceId ? `/erm/titles/${localEresourceId}` : null}>
      <Icon icon={!localEresourceId ? 'eye-closed' : 'eye-open'}>
        <FormattedMessage id="ui-agreements.remoteKb.actions.viewInLocalKb" />
      </Icon>
    </Button>);
};

ViewInLocalKbButton.propTypes = propTypes;

export default ViewInLocalKbButton;
