import { CroppedImageProvider } from './CropperContext';
import ProfilePictureWrapper from "./Uploader";

function UploadWrapper(props: any) {
    return (
        <CroppedImageProvider>
            <ProfilePictureWrapper updateData={props.updateData} />
        </CroppedImageProvider>
    )
}

export default UploadWrapper;
