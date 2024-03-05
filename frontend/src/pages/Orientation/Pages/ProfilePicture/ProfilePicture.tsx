import { useBatchAddListener, useBatchFinishListener } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { useState } from "react";
import { FileLike } from "@rpldy/shared";
import { UploadPreview } from "@rpldy/upload-preview"

// Error type with similiar shape to the error type Uploady expects in its error-handling callback functions
interface FileInvalidEventDetail {
    file: FileLike; // The File object that was attempted to be uploaded
    issues: {
        [key: string]: boolean; // A map of issues encountered with the file, e.g., type, size
    };
}

function getErrorMsg(err: FileInvalidEventDetail) {
    let msg = '';
    if(err) {
        msg += `Could not upload ${err.file.name}: `;

        if(err.issues.accept) {
            msg += `invalid file type. Only image files are acceptable.`;
        } else if(err.issues.size) {
            msg += `file too large.`;
        } else {
            // TODO: Report other possible errors
            msg += `Unknown error`;
        }
    }
    return msg;
}

function ProfilePicture(props: any) {
    const [inputError, setInputError] = useState<FileInvalidEventDetail | null>(null);

    // Throw error if uploaded file is not of image type and bar Uploady from uploading the offending file
    useBatchAddListener((batch) => {
        const index = batch.items.findIndex((item) => 
            !item.file.type.startsWith("image/")
        );
        
        if (index >= 0) {
            setInputError({
                file: batch.items[index].file,
                issues: { accept: true }
            });
            return false; // Prevents the upload from starting
        } else {
            setInputError(null);
            return true;
        }
    });

    useBatchFinishListener((batch) => {
        // TODO: Retrieve the upload URL
        // const item = batch.items[0] 
        // props.updateData([{ contentType: item.file.type, path: item.uploadResponse }]);
    });

    return (
        <div>
            {inputError && (
                <div>{getErrorMsg(inputError)}</div>
            )}

            <UploadPreview />
            <UploadButton />
        </div>
    );
}

export default ProfilePicture;
