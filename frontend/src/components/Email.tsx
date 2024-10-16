export type Email = {
    _id?: string;
    name?: string;
    role?: string;
    email?: string;
};

export const DefaultEmptyEmail: Email = {
    _id: undefined,
    name: '',
    role: 'moderator',
    email: '',
}    