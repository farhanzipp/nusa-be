import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../entities/user.entity";
import { CreateUserDto } from "../../modules/users/dto/create-user.dto";
import { DataSource, Repository } from "typeorm";
@Injectable()
export default class UserRepository extends Repository<UserEntity> {
    constructor(private dataSource: DataSource) {
        super(UserEntity, dataSource.createEntityManager());
    }

    async createUser(
        createUserDto: CreateUserDto,
        // userId?: number,
    ): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = ett.create(UserEntity, {
            ...createUserDto,
            // createdBy: userId,
        });

        return await ett.save(user);
    }

    async findById(id: number): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = await ett.findOne(UserEntity, {
            where: { id },
        });
        return user;
    }

    async findByUsername(username: string): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = await ett.findOne(UserEntity, {
            where: {
                username,
            },
        });
        return user;
    }

    async findByEmail(email: string): Promise<UserEntity> {
        const ett = this.dataSource.createEntityManager();
        const user = await ett.findOne(UserEntity, {
            where: {
                email,
            },
        });
        return user;
    }
}
