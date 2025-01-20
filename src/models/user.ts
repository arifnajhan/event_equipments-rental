export type User = {
    _id: string;
    name: string;
    email: string;
    phoneNumber: number;
    isAdmin: boolean;
    about: string | null;
    _createdAt: string;
    image: string;
};