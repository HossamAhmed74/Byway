import { atom } from "jotai";

export const loginFormAtom = atom({
    email: "",
    password: ""
})

export const loginErrorsAtom = atom({
    email: "",
    password: ""
})

