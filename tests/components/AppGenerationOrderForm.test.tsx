import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppGenerationOrderForm from '../../src/components/AppGenerationOrderForm';

describe('AppGenerationOrderForm', () => {
  it('renders the form with all fields', () => {
    render(<AppGenerationOrderForm />);

    expect(screen.getByText('App Generation Order Form')).toBeInTheDocument();
    expect(screen.getByLabelText('App Name')).toBeInTheDocument();
    expect(screen.getByLabelText('App Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate App' })).toBeInTheDocument();
  });

  it('allows user to input app name', () => {
    render(<AppGenerationOrderForm />);

    const nameInput = screen.getByLabelText('App Name');
    fireEvent.change(nameInput, { target: { value: 'Test App' } });

    expect(nameInput).toHaveValue('Test App');
  });

  it('allows user to select app type', () => {
    render(<AppGenerationOrderForm />);

    const typeSelect = screen.getByLabelText('App Type');
    fireEvent.change(typeSelect, { target: { value: 'mobile' } });

    expect(typeSelect).toHaveValue('mobile');
  });

  it('allows user to input description', () => {
    render(<AppGenerationOrderForm />);

    const descTextarea = screen.getByLabelText('Description');
    fireEvent.change(descTextarea, { target: { value: 'Test description' } });

    expect(descTextarea).toHaveValue('Test description');
  });

  it('submits the form with correct data', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<AppGenerationOrderForm />);

    const nameInput = screen.getByLabelText('App Name');
    const submitButton = screen.getByRole('button', { name: 'Generate App' });

    fireEvent.change(nameInput, { target: { value: 'Test App' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Generating app:', {
        name: 'Test App',
        type: 'web',
        description: ''
      });
    });

    consoleSpy.mockRestore();
  });
});
