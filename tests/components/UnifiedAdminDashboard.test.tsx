import React from 'react';
import { render, screen } from '@testing-library/react';
import UnifiedAdminDashboard from '../../src/components/admin/UnifiedAdminDashboard';

describe('UnifiedAdminDashboard', () => {
  it('renders the dashboard with title', () => {
    render(<UnifiedAdminDashboard />);

    expect(screen.getByText('Unified Admin Dashboard')).toBeInTheDocument();
  });

  it('renders all dashboard sections', () => {
    render(<UnifiedAdminDashboard />);

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Order Management')).toBeInTheDocument();
    expect(screen.getByText('System Statistics')).toBeInTheDocument();
    expect(screen.getByText('Content Management')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders section descriptions', () => {
    render(<UnifiedAdminDashboard />);

    expect(screen.getByText('Manage users, roles, and permissions')).toBeInTheDocument();
    expect(screen.getByText('View and manage orders')).toBeInTheDocument();
    expect(screen.getByText('View system metrics and performance')).toBeInTheDocument();
  });

  it('renders in a responsive grid layout', () => {
    render(<UnifiedAdminDashboard />);

    const grid = screen.getByRole('generic'); // The div with grid classes
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });
});
