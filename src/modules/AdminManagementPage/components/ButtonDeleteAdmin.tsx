'use client';

import { deleteAdmin } from '@/api/admin/requests';
import type { ICategory } from '@/api/category/types';
import { Icons } from '@/assets/icons';
import { AlertDialogComponent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn, onMutateError } from '@/libs/common';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ButtonDeleteAdmin = ({ _id, name, refetch }: Partial<ICategory> & { refetch: any }) => {
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);
  
  const { mutate, isLoading } = useMutation(deleteAdmin);

  const handleRemoveBattle = () => {
    mutate(String(_id), {
      onSuccess: async () => {
        refetch();
        toast.success('The admin has been delete successfully!');
      },
      onError: onMutateError,
    });
    return;
  };

  return (
    <AlertDialogComponent
      onOk={handleRemoveBattle}
      description={
        <div>
          <p className="line-clamp-4 font-medium text-lg">Are you sure you want to delete the admin "{name}"?</p>
        </div>
      }
      isOpen={isDeleteConfirm}
      setIsOpen={setIsDeleteConfirm}
      title="Delete battle"
      variant="alert"
      okText={<>Delete</>}
      cancelText={<>Back</>}
      loading={isLoading}
    >
      <Button
        onClick={() => setIsDeleteConfirm(true)}
        className={cn('hover:opacity-80', {
          'cursor-not-allowed opacity-60 hover:opacity-60': false,
        })}
        size="xs"
        type="button"
      >
        <Icons.trash className="ml-1" />
      </Button>
    </AlertDialogComponent>
  );
};

export default ButtonDeleteAdmin;
