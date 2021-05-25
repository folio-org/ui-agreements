import React from 'react';

import { Row } from '@folio/stripes/components';
import { renderUserName } from '@folio/stripes-erm-components';

import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

const InternalContactsArrayDisplay = ({ contacts }) => {
  const userFetchQuery = contacts.reduce((acc, curr, index) => {
    if (index == 0) {
      acc += curr.user
    } else {
      acc += `%20or%20id%3D%3D${curr.user}`
    }
    return acc;
  }, "")
  const ky = useOkapiKy();
  const { data } = useQuery(
    ['ui-dashboard', 'setUpRegistry', 'internalContactsRenderFunction'],
    () => ky(`users?limit=100&query=id%3D%3D${userFetchQuery}`).json()
  );
  
  const userList = contacts.map (record => {
    const role = record.role?.label ? `${record.role.label}: ` : '';
    const user = (data?.users?.find( u => u.id === record.user))
    return (
      <Row>
        {`${role}${renderUserName(user)}`}
      </Row>
    );
  });

  return userList;
}

export default InternalContactsArrayDisplay;
