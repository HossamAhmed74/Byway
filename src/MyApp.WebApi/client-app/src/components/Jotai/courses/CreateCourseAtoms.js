import { atom } from "jotai";

export const ratingAtom = atom(0);
export const descriptionAtom = atom("");
export const certificationAtom = atom("");
export const currentStepAtom = atom(1);
export const isAddOpenAtom = atom(true);
export const categoriesList = atom([]);
export const instructorsList = atom([]);
export const coursesAtom = atom([]);

export const filtrationAtom = atom({
    categories: [],       
    lecturesNumber : [0, 45],          
    priceRange: [0, 980],
    rating: 0             
  });
  

export const CreateCourseAtoms = atom({
    name: "",
    level: null,
    InstructorId: null,
    description: "",
    certification: "",
    categoryId: null,
    cost: 0,
    image: null,
    rate: 0,
    totalHours: 0,
    courseContent: [
        {
            id: crypto.randomUUID(), // ✅ unique identifier
            contentName: "",
            lecturesNumber: 0,
            time: 0,
        },
    ],
});
