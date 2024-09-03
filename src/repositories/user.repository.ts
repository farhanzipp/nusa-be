import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../modules/users/dto/create-user.dto";
import { DataSource, Repository } from "typeorm";
import { UpdateUserDto } from "src/modules/users/dto/update-user.dto";
@Injectable()
export default class UserRepository extends Repository<UserEntity> {
    constructor(private dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = ett.create(UserEntity, {
            ...createUserDto,
            // createdBy: userId,
        });

        return await ett.save(user);
    }

    async findAllUsers(): Promise<UserEntity[]> {
        const ett = this.dataSource.createEntityManager();
        const users = await ett.find(UserEntity);
        return users;
    }

    async findOneUserById(id: number): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = await ett.findOne(UserEntity, {
            where: { id },
        });
        return user;
    }

    async findOneUserByUsername(username: string): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = await ett.findOne(UserEntity, {
            where: {
                username,
            },
        });
        return user;
    }

    async findOneUserByEmail(email: string): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = await ett.findOne(UserEntity, {
            where: {
                email,
            },
        });
        return user;
    }

    async updateUser(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<UserEntity> {
        const user = await this.findOneUserById(id);
        const ett = this.dataSource.createEntityManager();
        const updatedUser ={ ...user, ...updateUserDto };
        return await ett.save(UserEntity,updatedUser);
    }

    async removeUser(id: number): Promise<void> {
        const ett = this.dataSource.createEntityManager();
        await ett.delete(UserEntity, { id });
    }
}
