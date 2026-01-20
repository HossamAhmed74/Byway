import { atom } from "jotai";

export const registerFormAtom = atom({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    fullName:""
})

export const registerErrorsAtom = atom({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
})