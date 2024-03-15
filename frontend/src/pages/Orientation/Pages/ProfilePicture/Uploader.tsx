import Uploady from '@rpldy/uploady';
import ProfilePicture from './ProfilePicture';
import { useCroppedImage } from './CropperContext';
import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';

function Uploader(props: any) {
    const [signedUrl, setSignedUrl] = useState<string>();
    const {setImageRemotePath} = useCroppedImage();
    
    useEffect(() => {
        const document = gql`
        {
            generatePresignedURL
        }
        `;

        request(process.env.REACT_APP_API!, document)
            .then((data: any) => {
                let url = new URL(data.generatePresignedURL);
                // Remove leading forward slash
                setImageRemotePath(url.pathname.substring(1));
                setSignedUrl(data.generatePresignedURL);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <>
            {/* Writable signed endpoints expect PUT requests, not POST requests */}
            <Uploady
                accept="image/*"
                multiple={false}
                method="PUT"
                destination={{
                    url: signedUrl
                }}
                sendWithFormData={false}
                >
                {/* 
                Future Plan:
                - Allow uploading more than one image if the user is registered
                */}
                <ProfilePicture updateData={props.updateData} />
            </Uploady>
        </>
    );
}

export default Uploader;
