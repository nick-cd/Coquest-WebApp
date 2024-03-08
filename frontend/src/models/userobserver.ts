import { of } from 'rxjs';
import { Topic, Motive, Image, Location, Skill, Badge, Recommendations } from "./common";
import { Community } from './communityobserver';

export type User = {
    id: string;
    name: string;
    username: string;
    email: string;
    /*
    The progress of registration; it is either a boolean or a Number[1, NUM_OF_STEPS].
    
    Interpretations:
    - Boolean: Signifies whether the user has yet to start or has completed the registration process 
    - Number[1, NUM_OF_STEPS]: Indicates the step on which the user is actively working
    */
    registered: boolean | number;
    /*
    Location uses null to represent safe empty state to prevent prepopulating map data
    when geolocating for the first time  
    */
    location: Location | null;
    images: Image[];
    motives: Motive[];
    biography: string;
    topics: Topic[];
    // Expandable set of affliated communities
    communities: Community[] | string[];
    // The following properties are a part of the reputation system
    skills: Skill[];
    badges: Badge[];
    currentLevel: number;
    recommendations: Recommendations[];
};

// A data modal backed by the corresponding document on MongoDB
export const userModel: User = {
    id: "",
    name: "test",
    username: "",
    email: "",
    registered: false,
    location: null,
    images: [
        generateProfileImg(),
    ],
    motives: [],
    biography: "",
    communities: [],
    topics: [],
    skills: [],
    badges: [],
    currentLevel: 0,
    recommendations: [],
};

export function generateProfileImg(): Image {
    const randString = Math.random().toString(36).substring(2);

    return {
        contentType: "image/svg+xml",
        path: `https://api.dicebear.com/7.x/thumbs/svg?size=400&radius=50&backgroundColor=transparent&seed=${randString}`,
    };
}

// TODO: Business logic to bridge application with web API

// TODO: Use RXJS to fetch dynamic data 
// https://www.learnrxjs.io/learn-rxjs/operators/creation/ajax
// export const userObservable = ajax.getJSON(endpoint);
export const userObservable = of(userModel);

// TODO: Use RXJS to update the user in question
// const postObservable = ajax.post('https://your-api-endpoint.com/post', JSON.stringify(postData), headers)
