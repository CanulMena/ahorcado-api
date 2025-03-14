import { Request, Response } from 'express';
import { CustomError } from '../../domain/errors/custom-error';


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
    res.status(200).json({ message: 'word registered' });
  }

} 