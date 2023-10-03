// export class User {
//     constructor(
//         private id: number,
//         private email: string,
//         private username: string,
//         private password: string
//     ) { }

import { Language } from "./language"

//     getId(): number {
//         return this.id;
//     }
// }

export interface User {
    id: number,
    email: string,
    username: string,
    password: string,
    gender: string,
    dob: Date,
    teachLanguages: Language[],
    learnLanguages: Language[],
    selfIntroduction: string
}