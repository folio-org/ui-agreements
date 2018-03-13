import React from 'react';
import {observable} from 'mobx';
import { observer } from 'mobx-react';
import app from './lib/folio-stripes/app';
import ResourceBasedComponent from './lib/resource/resource-based-component';

const Home = observer(() => {
  let user = observable (app.user);
  return (
    <div>
      <p>Welcome { app.user.firstName }, { app.user.lastName }.</p>
      <ResourceBasedComponent resourceType="users" />
    </div>
  );
});

export default Home;