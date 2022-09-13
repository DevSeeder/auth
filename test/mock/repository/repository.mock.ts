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

export const mockSecurityTokensMongoose = {
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
