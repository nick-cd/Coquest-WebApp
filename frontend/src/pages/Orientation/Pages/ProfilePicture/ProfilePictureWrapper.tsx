import Uploady from '@rpldy/uploady';
import ProfilePicture from './ProfilePicture';

function ProfilePictureWrapper(props: any) {
    return (
        <Uploady
            accept="image/*"
            multiple={false}
            method='PUT'
            >
            {/* 
            TODO: 
            - Set destination prop
            - Upload image as BLOB and save the path with the userModel
            - Allow uploading more than one image if the user is registered
            */}
            <ProfilePicture updateData={props.updateData} />
        </Uploady>
    );
}

export default ProfilePictureWrapper;
