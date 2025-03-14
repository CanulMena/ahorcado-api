import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';
import { RegisterUserDto } from '../../domain/dtos/register-user.dto';
import { AuthService } from '../services/auth-service';


export class AuthController {
  constructor(
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public registerUser = async (req: Request, res: Response) => {
    
    const [ error, registerUserDto ] = RegisterUserDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new AuthService()
    .registerUser(registerUserDto!)
    .then( user => res.status(200).json(user))
    .catch( error => this.handleError(error, res));
  }

  public getAll = async (req: Request, res: Response) => {
    new AuthService()
    .getAll()
    .then( users => res.status(200).json(users))
    .catch( error => this.handleError(error, res));
  }

} 