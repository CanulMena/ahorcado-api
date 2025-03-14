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
        correo: registerUserDto.email,
        contrasena: registerUserDto.passwordHash,
        rol: registerUserDto.rol
      }
    });

    if( !userCreated ) throw CustomError.badRequest('user not created');

    return UserEntity.fromJson(userCreated);
  }

}