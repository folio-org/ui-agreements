import React from 'react';
import PropTypes from 'prop-types';
import { mapValues } from 'lodash';
import { withStripes } from '@folio/stripes/core';

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

export default function withAccordionHandlers(WrappedComponent) {
  class WithAccordionHandlers extends React.Component {
    static propTypes = {
      handlers: PropTypes.object,
      stripes: PropTypes.shape({
        okapi: PropTypes.shape({
          tenant: PropTypes.string.isRequired,
          token: PropTypes.string.isRequired,
          url: PropTypes.string,
        }).isRequired,
      }).isRequired,
    };

    static defaultProps = {
      handlers: { },
    }

  handleCollapseAllSections = (e, ref) => {
    e.preventDefault();
    const { state, setStatus } = ref.current;
    setStatus(() => mapValues(state, () => false));
  };

 handleExpandAllSections = (e, ref) => {
   e.preventDefault();
   const { state, setStatus } = ref.current;
   setStatus(() => mapValues(state, () => true));
 };

 render() {
   const { handlers, ...rest } = this.props;

   return (
     <WrappedComponent
       handlers={{
         ...handlers,
         collapseAllSections: this.handleCollapseAllSections,
         expandAllSections: this.handleExpandAllSections,
       }}
       {...rest}
     />
   );
 }
  }

  WithAccordionHandlers.displayName = `WithAccordionHandlers(${getDisplayName(WrappedComponent)})`;
  return withStripes(WithAccordionHandlers);
}
