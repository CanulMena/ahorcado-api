import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { UserEntity } from '../../domain/entities/user';
import { CustomError } from '../../domain/errors/custom-error';
import { bcryptAdapter } from '../../config/plugins/bcryptAdapter';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';
import { jwtAdapter } from '../../config/plugins/jwtAdapter';
import { envs } from '../../config/envs';

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

  public async login( loginUserDto: LoginUserDto): Promise<{ user: Omit<UserEntity, 'passwordHash'>, token: string }> {
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
    const accessToken = await jwtAdapter.generateToken({
      payload: { id: userFound.id },
      secret: envs.JWT_SEED,
      expiresIn: '1d'
    });
    return {
      user: UserWithoutPassword,
      token: accessToken
    };
  }

  public async getUserById( userId: number ): Promise<UserEntity> {
    const userFound = await this.prisma.findUnique({
      where: {
        id: userId
      }
    });
    if (!userFound) throw CustomError.badRequest(`User not found with id ${userId}`);
    const userEntity = UserEntity.fromJson(userFound);
    return userEntity;
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