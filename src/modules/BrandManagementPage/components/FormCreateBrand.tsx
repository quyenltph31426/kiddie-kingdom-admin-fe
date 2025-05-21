import { createBrand } from '@/api/brand/requests';
import { Icons } from '@/assets/icons';
import H3 from '@/components/text/H3';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FormWrapper } from '@/components/ui/form';
import { HStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { type BrandSchema, brandSchema } from '../libs/validators';
import FormCategory from './FormBrand';

type Props = {
  refetch: any;
};
const FormCreateBrand = ({ refetch }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const { mutate, isLoading } = useMutation(createBrand);

  const form = useForm<BrandSchema>({
    defaultValues: {
      website: '',
      logo: '',
      name: '',
      description: '',
    },
    resolver: zodResolver(brandSchema),
  });

  const handleSubmit: SubmitHandler<BrandSchema> = async (formData) => {
    mutate(formData, {
      onSuccess: () => {
        toast.success('Tạo thương hiệu thành công!');
        setIsOpenModal(false);
        refetch();
      },
      onError: onMutateError,
    });
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={setIsOpenModal}>
      <DialogTrigger asChild>
        <Button>
          <Icons.plus />
          Thêm thương hiệu
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] max-w-[520px] overflow-y-auto rounded-t-md border-none p-0 shadow-none">
        <div className="px-6 py-2">
          <HStack pos="apart" noWrap align="center">
            <HStack className="mt-3 h-12 w-12 rounded-full border bg-[#4D9E2A26] " pos="center">
              <Icons.user className="w-5 stroke-primary-400" />
            </HStack>

            <span className="cursor-pointer rounded-sm p-1 hover:bg-grey-100" onClick={() => setIsOpenModal(false)}>
              <Icons.X className="stroke-grey-500" />
            </span>
          </HStack>

          <H3 className="mt-4">Tạo mới thương hiệu</H3>

          <div className="my-6">
            <FormWrapper form={form} onSubmit={handleSubmit}>
              <FormCategory />
              <HStack pos="center" spacing={20} className="mt-10">
                <Button size="sm" variant="outline" className="flex-1 px-6" onClick={() => setIsOpenModal(false)}>
                  Hủy
                </Button>

                <Button type="submit" size="sm" className="flex-1 px-6" loading={isLoading} disabled={!form.formState.isDirty || isLoading}>
                  Tạo mới
                </Button>
              </HStack>
            </FormWrapper>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormCreateBrand;
