import { useCallback, useRef, useState } from 'react';
import styled from "styled-components";
import Cropper, { ReactCropperElement } from 'react-cropper';
import { useCroppedImage } from './CropperContext';
import "cropperjs/dist/cropper.css";
import { Button } from '@mui/material';

const CROP_WIDTH = 400; 
const CROP_HEIGHT = 400;

const CropContainer = styled.div`
margin: auto;
display: flex;
flex-direction: column;
justify-content: space-evenly;
align-items: center;
`;

const PreviewImage = styled.img`
margin: auto;
max-width: ${CROP_WIDTH}px;
max-height: ${CROP_HEIGHT}px;
height: auto;
border-radius: 50%;
`;

interface ImageDimensions {
    width: number;
    height: number;
};

function CropperComponent({id, src, updateRequest, requestData}: any) {
    const cropperRef = useRef<ReactCropperElement>(null);
    const { imageUrl, setImageUrl, setImageType } = useCroppedImage();
    const [ uploadedDimensions, setUploadedDimensions ] = useState<ImageDimensions>({width: 0, height: 0}); 

    // Resume the uploading process with the users crop selection 
    const onCropUpload = useCallback(() => {
        const cropper = cropperRef.current?.cropper;

        if(cropper) {
            let file = requestData.items[0].file;
            const imageType = file.type; 
            const cropData = cropper.getData(true);
            setUploadedDimensions({width: cropData.width, height: cropData.height});
            // Pass the image type to HTMLCanvasElement.toDataURL to prevent enlarging the image
            // https://github.com/fengyuanchen/cropperjs?tab=readme-ov-file#known-issues
            setImageUrl(cropper.getCroppedCanvas().toDataURL(imageType));
            setImageType(imageType);

            cropper.getCroppedCanvas({
                rounded: true,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            }).toBlob((blob: Blob | null) => {
                if(blob) {
                    file = new File([blob], file.name, {type: imageType});
                    updateRequest({items: requestData.items});
                }
            }, imageType);
        }
    }, [updateRequest, requestData, setImageType, setImageUrl]);

    return (
        <CropContainer>
            <Cropper
                style={{
                    // Limit size of container
                    maxHeight: '20em'
                }}
                initialAspectRatio={CROP_WIDTH / CROP_HEIGHT}
                aspectRatio={CROP_WIDTH / CROP_HEIGHT}
                src={src}
                // Automatically display a crop area at the centre of the image, covering the input percentage
                autoCropArea={0.3}
                background={true}
                modal={true}
                zoomable={false}
                ref={cropperRef}
            />

            {/* Button to preview selection */}
            <Button onClick={onCropUpload}>Upload Selection</Button>

            {/* Fill full-size preview container with the default fill colour, black */}
            <div style={{
                position: 'relative',
                width: CROP_WIDTH,
                height: CROP_HEIGHT,
                border: '1px solid black',
                }}>

                {imageUrl &&
                    <>
                        {/* Centre the image in preview container */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            // Exactly centres the image
                            transform: 'translate(-50%, -49.5%)',
                            }}>
                            <PreviewImage src={imageUrl} alt='Cropped upload' />
                        </div>
                    </>            
                }
            </div>

        </CropContainer>
    );
}

export default CropperComponent;