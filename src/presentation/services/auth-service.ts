import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { UserEntity } from '../../domain/entities/user';
import { CustomError } from '../../domain/errors/custom-error';

export class AuthService {
  constructor(
  ){}

  private readonly prisma = new PrismaClient().usuario;

  public async registerUser( registerUserDto:RegisterUserDto ): Promise<UserEntity> {
    const userCreated = await this.prisma.create({ 
      data: {
        nombre: registerUserDto.name,
        apellidos: registerUserDto.apellidos,
        direccion: registerUserDto.direccion,
        localidad: registerUserDto.localidad,
        municipio: registerUserDto.municipio
      }
    });

    if( !userCreated ) throw CustomError.badRequest('user not created');

    return UserEntity.fromJson(userCreated);
  }

  public async getAll(): Promise<UserEntity[]> {
    const users = await this.prisma.findMany();
    return users.map( (user: UserEntity) => UserEntity.fromJson(user));
  }
}