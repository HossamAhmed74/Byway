import { atom } from "jotai";

export const instructorFormAtom = atom({
    image:'',
    name: "",
    jobTitleId: null,
    jobTitle :"",
    rate: 0,
    description: "",
})

export const instructorFormErrorsAtom = atom({
    name: "",
    image:"",
    jobTitleId: "",
    jobTitle :"",
    rate: "",
    description: "",
})

// fetch data (job titles) from api
export const jobTitlesAtom = atom([]);
// fetch instructor data from api 
export const instructorsAtom = atom([]);
    
