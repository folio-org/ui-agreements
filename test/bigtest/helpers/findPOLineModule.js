import React from 'react';
import { pickBy } from 'lodash';
import { faker } from '@bigtest/mirage';
import { Button } from '@folio/stripes/components';

const { number, uuid, words } = faker.random;

const poLines = [];
for (let i = 0; i < 100; i++) {
  poLines[i] = {
    acquisitionMethod: faker.finance.transactionType(),
    id: uuid(),
    poLineNumber: `${number()}${number()}-${number()}${number()}${number()}`,
    title: words(),
  };
}

let currentIndex = -1;

export default ({
  type: 'plugin',
  name: '@folio/ui-plugin-find-po-line-dummy',
  displayName: 'Find PO Line',
  pluginType: 'find-po-line',
  module: (props) => {
    const dataProps = pickBy(props, (_, key) => /^data-test/.test(key));

    return (
      <Button
        {...dataProps}
        onClick={() => {
          currentIndex += 1;
          return props.addLines([poLines[currentIndex]]);
        }}
      >
        Select PO Line #{currentIndex + 1}
      </Button>
    );
  }
});

const getCurrentPOLine = () => poLines[currentIndex];

export {
  getCurrentPOLine,
  poLines,
};
