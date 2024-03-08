import Uploady from '@rpldy/uploady';
import ProfilePicture from './ProfilePicture';
import { CroppedImageProvider } from './CropperContext';

function ProfilePictureWrapper(props: any) {
    return (
        <CroppedImageProvider>
            <Uploady
                accept="image/*"
                multiple={false}
                method="POST"
                >
                {/* 
                TODO: 
                - Set up destination object with URL and Content-Type header set (https://react-uploady.org/docs/api/#destination)
                - Upload image as BLOB and save the path with the userModel

                Future Plan:
                - Allow uploading more than one image if the user is registered
                */}
                <ProfilePicture updateData={props.updateData} />
            </Uploady>
        </CroppedImageProvider>
    );
}

export default ProfilePictureWrapper;
