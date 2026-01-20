import { atom } from "jotai";

export const purchaseProcessAtom = atom({
    country : '',
    state : '',
    paymentMethod : '',
    cardName :'',
    cardNumber : '',
    expiryDate : '',
    CVV :'',
    coursesIds :[],
    discount : 0,
    tax : 0,
    totalAmount : 0
}); 