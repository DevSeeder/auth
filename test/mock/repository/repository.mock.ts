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
    findOne: () => {
        return [];
    },
    findById: () => {
        return [];
    },
    updatePassword: () => {
        return;
    },
    updateActive: () => {
        return;
    },
    searchUser: () => {
        return;
    },
    updateInfo: () => {
        return;
    }
};

export const mockMongoose = {
    find: () => {
        return [];
    },
    findOne: () => {
        return [];
    }
};

export const mockScopesMongoose = {
    find: () => {
        return [];
    },
    findOne: () => {
        return [];
    },
    searchScope: () => {
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

export const mockProjectMongoose = {
    find: () => {
        return [];
    },
    findOne: () => {
        return [];
    },
    searchProject: () => {
        return [];
    },
    getProjectByKey: () => {
        return;
    }
};
