import { mockMongooseRepo } from './mongoose.mock';

export const mockUserMongoose = {
    createUser: () => {
        return;
    },
    updateAddUserScopes: () => {
        return;
    },
    getScopesByUser: () => {
        return [];
    },
    find: () => {
        return [];
    },
    updatePassword: () => {
        return;
    }
};

export const mockMongoose = {
    find: () => {
        return [];
    }
};

export const mockSecurityTokensMongoose = () => {
    const mock = {
        inactiveActualTokens: () => {
            return;
        },
        checkConfirmationCode: () => {
            return;
        },
        updateConfirmToken: () => {
            return;
        },
        pushLogAttempt: () => {
            return;
        }
    };

    return { ...mock, ...mockMongooseRepo };
};
