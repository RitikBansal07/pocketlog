import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmModal } from '../src/components/ui/ConfirmModal';

describe('DestructiveActions (ConfirmModal)', () => {
  it('renders confirmation modal with destructive warning styling', async () => {
    const onConfirmMock = jest.fn();
    const onCancelMock = jest.fn();

    const { getByText, getByTestId } = await render(
      <ConfirmModal
        visible={true}
        title="Delete Reflection?"
        message="This action cannot be undone."
        confirmLabel="Erase"
        cancelLabel="Keep"
        destructive={true}
        onConfirm={onConfirmMock}
        onCancel={onCancelMock}
        testID="test-confirm-modal"
      />
    );

    expect(getByText('Delete Reflection?')).toBeTruthy();
    expect(getByText('This action cannot be undone.')).toBeTruthy();

    const confirmBtn = getByTestId('confirm-modal-confirm-btn');
    fireEvent.press(confirmBtn);
    expect(onConfirmMock).toHaveBeenCalledTimes(1);

    const cancelBtn = getByTestId('confirm-modal-cancel-btn');
    fireEvent.press(cancelBtn);
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
