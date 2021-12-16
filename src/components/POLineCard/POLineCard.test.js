import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@folio/stripes-erm-components/test/jest/__mock__';
import { render, screen } from '@testing-library/react';
import POLineCard from './POLineCard';

const queryClient = new QueryClient();
const acquisitionMethod = [];
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderPOLineCard = (data) => render(
  <POLineCard
    acquisitionMethod={acquisitionMethod}
    {...data}
  />,
  { wrapper },
);

describe('POLineCard', () => {
  it('should render \'POLine Card\' view', async () => {
    renderPOLineCard();
    screen.debug();

    expect(screen.getByText('ui-agreements.poLines.poLineWithNumber')).toBeInTheDocument();
    expect(screen.getByText('ui-agreements.poLines.acqMethod')).toBeInTheDocument();
    expect(screen.getByText('ui-agreements.poLines.title')).toBeInTheDocument();
    expect(screen.getByText('ui-agreements.poLines.viewInInventory')).toBeInTheDocument();
  });
});
