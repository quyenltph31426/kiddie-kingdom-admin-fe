'use client';

import { deleteBrand } from '@/api/brand/requests';
import type { ICategory } from '@/api/category/types';
import { Icons } from '@/assets/icons';
import { AlertDialogComponent } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn, onMutateError } from '@/libs/common';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ButtonDeleteBrand = ({ _id, name, refetch }: Partial<ICategory> & { refetch: any }) => {
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<boolean>(false);
  const { mutate, isLoading } = useMutation(deleteBrand);

  const handleRemoveBattle = () => {
    mutate(String(_id), {
      onSuccess: async () => {
        refetch();
        toast.success('Xóa thương hiệu thành công!');
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
          <p className="line-clamp-4 font-medium text-lg">Bạn có chắc chắn muốn xóa thương hiệu "{name}"?</p>
        </div>
      }
      isOpen={isDeleteConfirm}
      setIsOpen={setIsDeleteConfirm}
      title="Xóa thương hiệu"
      variant="alert"
      okText={<>Xóa</>}
      cancelText={<>Hủy</>}
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

export default ButtonDeleteBrand;
