import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

const PACKAGE_CLASS = 'org.olf.kb.Pkg';

const isPackage = (resource) => {
  return resource.class === PACKAGE_CLASS;
};

const renderResourceType = (resource) => {
  if (isPackage(resource)) return <FormattedMessage id="ui-erm.eresources.package" />;

  return get(
    resource,
    ['_object', 'pti', 'titleInstance', 'type', 'label'],
    <FormattedMessage id="ui-erm.eresources.title" />
  );
};

export {
  isPackage,
  renderResourceType
};
