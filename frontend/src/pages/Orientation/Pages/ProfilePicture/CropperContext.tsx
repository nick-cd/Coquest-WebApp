import { ReactNode, createContext, useContext, useState } from 'react';

interface CroppedImageContextType {
    imageUrl: string | null;
    setImageUrl: (url: string | null) => void;
    imageType: string | null;
    setImageType: (type: string | null) => void;
}

const CroppedImageContext = createContext<CroppedImageContextType | undefined>(undefined);

export const useCroppedImage = () => {
    const context = useContext(CroppedImageContext);
    if(!context) {
        throw new Error('useCroppedImage must be used within a CroppedImageProvider');
    }
    return context;
}

interface CroppedImageProviderProps {
    children: ReactNode; // Accepts any valid React child/children
}

export const CroppedImageProvider = ({ children }: CroppedImageProviderProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageType, setImageType] = useState<string | null>(null);

    return (
        <CroppedImageContext.Provider value={{ imageUrl, setImageUrl, imageType, setImageType}}>
            {children}
        </CroppedImageContext.Provider>
    );
};
