'use client';

import { useUpdateShippingStatusMutation } from '@/api/order/queries';
import { ShippingStatus, type ShippingStatusType } from '@/api/order/types';
import { uploadMultiFile } from '@/api/upload/requests';
import { Icons } from '@/assets/icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { HStack, Show, VStack } from '@/components/utilities';
import { onMutateError } from '@/libs/common';
import { useMutation } from '@tanstack/react-query';
import { Pencil, X } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { toast } from 'react-toastify';
import { SHIPPING_STATUS_OPTIONS, getValidShippingStatusTransitions } from '../libs/consts';

interface UpdateShippingStatusProps {
  orderId: string;
  currentStatus: ShippingStatusType;
  refetch: () => void;
}

const UpdateShippingStatus = ({ orderId, currentStatus, refetch }: UpdateShippingStatusProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ShippingStatusType>(currentStatus);
  const [note, setNote] = useState<string>('');

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate, isLoading } = useUpdateShippingStatusMutation();
  const validNextStatuses = getValidShippingStatusTransitions(currentStatus);

  const handleUpdateStatus = () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    mutate(
      { id: orderId, status: selectedStatus, shipperOfProof: uploadedImages, userNote: note },
      {
        onSuccess: () => {
          toast.success('Cập nhật trạng thái vận chuyển thành công!');
          setIsOpen(false);
          refetch();
        },
        onError: onMutateError,
      }
    );
  };

  const { mutate: uploadImage } = useMutation(
    (files: File[]) => {
      const filesArray = Array.from(files);
      setIsUploading(true);
      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append('files', file);
      });
      return uploadMultiFile(formData);
    },
    {
      onSuccess: (data) => {
        const newImages = data?.map((x) => x.url);
        setUploadedImages(newImages);
        setIsUploading(false);
      },
      onError: (error) => {
        onMutateError(error);
        setIsUploading(false);
      },
    }
  );

  const handleFileChange = (files: File[]) => {
    uploadImage(files);
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
  };

  return (
    <>
      <Button variant="ghost" size="icon" className="ml-1 h-6 w-6" onClick={() => setIsOpen(true)}>
        <Pencil className="h-3 w-3" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái vận chuyển</DialogTitle>
          </DialogHeader>

          <VStack spacing={16} className="py-4">
            <RadioGroup
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as ShippingStatusType)}
              className="space-y-3"
            >
              {Object.values(ShippingStatus).map((value) => {
                const isDisabled = !validNextStatuses.includes(value as ShippingStatusType) && value !== currentStatus;
                return (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={`shipping-${value}`} disabled={isDisabled} />
                    <label
                      htmlFor={`shipping-${value}`}
                      className={`font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                        value === selectedStatus ? 'text-primary' : ''
                      } ${isDisabled ? 'text-gray-400' : ''}`}
                    >
                      {SHIPPING_STATUS_OPTIONS.find((option) => option.value === value)?.label || value}
                      {isDisabled && value !== currentStatus && ' (không hợp lệ)'}
                    </label>
                  </div>
                );
              })}
            </RadioGroup>

            <VStack>
              <Label>Note (nếu có)</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nhập ghi chú" />
            </VStack>
            <Show when={selectedStatus === ShippingStatus.DELIVERED}>
              <div className="space-y-2">
                <Label>Thêm hình ảnh giao hàng *</Label>
                <FileUploader
                  maxSize={5}
                  minSize={0.001}
                  ref={fileRef}
                  name="file"
                  multiple
                  types={['JPG', 'PNG', 'JPEG']}
                  handleChange={handleFileChange}
                  onSizeError={() => toast.error('Image size must be less than 5MB')}
                  onTypeError={() => toast.error('Only JPG, PNG and JPEG files are allowed')}
                >
                  <div className="cursor-pointer rounded-md border-2 border-gray-300 border-dashed p-4 text-center hover:border-gray-400">
                    {/* <Icons.image className="mx-auto h-8 w-8 text-gray-400" /> */}
                    <p className="mt-2 text-gray-500 text-sm">Kéo và thả hoặc chọn hình ảnh</p>
                    <p className="text-gray-400 text-xs">PNG, JPG, JPEG (max 5MB)</p>
                  </div>
                </FileUploader>

                {/* Preview uploaded images */}
                <Show when={uploadedImages.length > 0}>
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="group relative h-20 w-20 overflow-hidden rounded-md">
                        <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Show>

                <Show when={isUploading}>
                  <div className="mt-2 flex items-center gap-2">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    <span className="text-gray-500 text-sm">Uploading image...</span>
                  </div>
                </Show>
              </div>
            </Show>
          </VStack>

          <HStack pos="apart" className="mt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isLoading || selectedStatus === currentStatus}>
              {isLoading ? <Icons.spinner className="h-4 w-4 animate-spin" /> : 'Cập nhật'}
            </Button>
          </HStack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateShippingStatus;
