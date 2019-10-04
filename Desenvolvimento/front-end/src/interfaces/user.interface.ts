import { Person } from "./person.interface";

export interface User {
	user_name: string;
	password: string;
    person: Person;
};
