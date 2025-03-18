import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';
import { RegisterGameDto } from '../../domain/dtos/register-game.dto';
import { GameService } from '../services/game-service';

export class GameController {
  constructor(
  ){}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  public register = async (req: Request, res: Response) => {
    
    const [ error, registerGameDto ] = RegisterGameDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }

    new GameService()
    .register(registerGameDto!)
    .then( game => res.status(200).json(game))
    .catch( error => this.handleError(error, res));

  }

  public ranking = async (req: Request, res: Response) => {
    new GameService()
    .GeneralRanking()
    .then( ranking => res.status(200).json(ranking))
    .catch( error => this.handleError(error, res));
  }

} 