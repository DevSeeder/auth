import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException
} from '@nestjs/common';
import { UsersMongoose } from './users.repository';
import { User } from './users.schema';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { ScopesService } from '../scopes/scopes.service';
import { GrantScopeUserDTO } from '../dto/grant-scope-user.dto';

dotenv.config();

@Injectable()
export class UsersService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private readonly userRepository: UsersMongoose,
        private readonly scopeService: ScopesService
    ) {}

    async createUser(user: User) {
        user.password = this.generateUserHash(user.password);

        this.logger.log(`Creating User '${user.username}'...`);

        await this.userRepository.createUser(user);

        return {
            success: true,
            response: 'User successfully created!'
        };
    }

    private generateUserHash(value: string) {
        const salt = bcrypt.genSaltSync(Number(process.env.ROUND_SALT));
        return bcrypt.hashSync(value, salt);
    }

    async getUserByUsername(username: string) {
        return this.userRepository.find<User>({
            username
        });
    }

    async validateUserByCredentials(user: User) {
        const userDB = await this.getUserByUsername(user.username);

        if (userDB.length === 0) return false;

        return this.validateUserPassword(user, userDB[0]);
    }

    private validateUserPassword(user: User, userDB: User) {
        return bcrypt.compareSync(user.password, userDB.password);
    }

    async grantScopeForUser(scopeDTO: GrantScopeUserDTO): Promise<any> {
        const userDB = await this.getUserByUsername(scopeDTO.username);

        if (userDB.length === 0) throw new NotFoundException('User not found!');

        await this.scopeService.validateScopes(scopeDTO.scopes);

        this.logger.log(`Grating user scopes...`);

        return this.userRepository.updateAddUserScopes(
            scopeDTO.username,
            scopeDTO.scopes
        );
    }

    async validateScopesForUser(
        username: string,
        scopes: string[]
    ): Promise<void> {
        const userScopesDB = await this.userRepository.getScopesByUser(
            username
        );

        for (const item of scopes) {
            if (userScopesDB.indexOf(item) === -1)
                throw new ForbiddenException(`Forbidden Scope '${item}'`);
        }
    }
}
