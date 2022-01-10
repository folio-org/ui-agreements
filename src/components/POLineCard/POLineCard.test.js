import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { render } from '@testing-library/react';
import '@folio/stripes-erm-components/test/jest/__mock__';
import translationsProperties from '../../../test/helpers';
import POLineCard from './POLineCard';

const data = {};
const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderPOLineCard = (props = {}) => render(
  <POLineCard
    poLine={data}
    {...props}
  />,
  { wrapper },
  translationsProperties
);

describe('POLineCard', () => {
  let renderComponent;
  it('should render POLine card', () => {
    renderPOLineCard();
    const { getByText } = renderComponent;
    expect(getByText('Acquisition method')).toBeInTheDocument();
    expect(getByText('Title in PO line')).toBeInTheDocument();
    expect(getByText('View in inventory')).toBeInTheDocument();
  });
});
