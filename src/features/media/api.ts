import api from "@/lib/api";
import {ImageUploadResponse} from "@/features/media/types";

export const mediaApi = {
    uploadImage: async (
        file: File,
    ) : Promise<ImageUploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post('images/upload-image', formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        return res.data
    }
}