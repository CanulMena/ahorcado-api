import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';
import { RegisterWordDto } from '../../domain/dtos/register-word.dto';
import { WordService } from '../services/word-service';
import { UpdateWordDto } from '../../domain/dtos/update-word.dto';


export class WordController {
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
    const [ error, wordDto ] = RegisterWordDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new WordService()
    .register(wordDto!)
    .then( word => res.status(200).json(word))
    .catch( error => this.handleError(error, res));
  }

  public getByDifficulty = async (req: Request, res: Response) => {
    const difficulty = req.params.difficulty;

    new WordService()
    .getByDifficulty(difficulty)
    .then( words => res.status(200).json(words))
    .catch( error => this.handleError(error, res));

  }

  public getAll = async (req: Request, res: Response) => {
    new WordService()
    .getAll()
    .then( words => res.status(200).json(words))
    .catch( error => this.handleError(error, res)); 
  }

  public getById = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    new WordService()
    .getById(id)
    .then( word => res.status(200).json(word))
    .catch( error => this.handleError(error, res));
  }

  public update = async (req: Request, res: Response) => {
    const id: number = +req.params.id;
    const [ error, updateWordDto ] = UpdateWordDto.create(req.body);
    if( error ) {
      res.status(400).json({ error: error });
      return
    }
    new WordService()
    .update(id, updateWordDto!)
    .then( word => res.status(200).json(word))
    .catch( error => this.handleError(error, res));
  }


} 