import { Button, Modal, ModalBody, ModalHeader, Textarea } from 'flowbite-react';
import React from 'react';
import { useForm } from 'react-hook-form';

export default function ShareModal({ isOpen, onClose, onShare, isPending }) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    onShare(data.body);
    reset();
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md" popup dismissible position="center">
      <ModalHeader className="border-b border-gray-100 px-4 py-3">
        <span className="text-lg font-bold text-gray-900 focus:outline-none">Share Post</span>
      </ModalHeader>
      <ModalBody className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-gray-500">
            Share this post to your feed with a custom caption.
          </p>
          <Textarea
            {...register('body')}
            placeholder="What's on your mind?..."
            rows={4}
            className="focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Sharing...' : 'Share Now'}
            </Button>
            <Button
              color="gray"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
}
