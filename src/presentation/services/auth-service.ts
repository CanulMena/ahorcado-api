import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { UserEntity } from '../../domain/entities/user';
import { CustomError } from '../../domain/errors/custom-error';
import { bcryptAdapter } from '../../config/plugins/bcryptAdapter';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';

export class AuthService {
  constructor(
  ){}

  private readonly prisma = new PrismaClient().usuario;

  public async register( registerUserDto: RegisterUserDto ): Promise<Omit<UserEntity, 'passwordHash'>> {
    const hashedPassword = bcryptAdapter.hash(registerUserDto.passwordHash);
    const userCreated = await this.prisma.create({ 
      data: {
        nombre: registerUserDto.name,
        correo: registerUserDto.email,
        contrasena: hashedPassword,
        rol: registerUserDto.rol
      }
    });
    //*Tengo que aprender a menejar el error cuando la el email ya existe.
    if( !userCreated ) throw CustomError.badRequest('user not created');
    const userEntity = UserEntity.fromJson(userCreated);
    const UserWithoutPassword = this.mapUserEntity(userEntity);
    return UserWithoutPassword;
  }

  public async login( loginUserDto: LoginUserDto): Promise<Omit<UserEntity, 'passwordHash'>> {
    const userFound = await this.prisma.findUnique({
      where: {
        correo: loginUserDto.email
      }
    });
    if (!userFound) throw CustomError.badRequest('User not found');
    const userEntity = UserEntity.fromJson(userFound);
    const isMatchingPassword = await bcryptAdapter.compare(loginUserDto.password, userFound.contrasena);
    if (!isMatchingPassword) throw CustomError.badRequest('Invalid password');
    const UserWithoutPassword = this.mapUserEntity(userEntity);
    return UserWithoutPassword;
  }
  
  private mapUserEntity(user: UserEntity): Omit<UserEntity, 'passwordHash'> {
    const { passwordHash, ...userEntity } = UserEntity.fromJson({
      "id": user.userId,
      "nombre": user.name,
      "correo": user.email,
      "contrasena": user.passwordHash,
      "rol": user.rol,
    });
    
    return userEntity;
  }

}