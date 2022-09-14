import { User } from './../../../src/microservice/domain/schema/users.schema';
export const mockUser = () => {
    const user = new User();
    user.name = 'any_name';
    user.username = 'any_username';
    user.projectKey = 'any_projectKey';
    return { ...user, _id: 1 };
};

export const mockUserPassword = (pass = 'any_password') => {
    const user = new User();
    user.name = 'any_name';
    user.password = pass;
    user.username = 'any_username';
    user.projectKey = 'any_projectKey';
    return { ...user, _id: 1 };
};
