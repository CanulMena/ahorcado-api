import { PrismaClient } from "@prisma/client";
import { WordEntity } from "../../domain/entities/word";
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterWordDto } from "../../domain/dtos/register-word.dto";

export class WordService {
  constructor(){}

  private readonly prisma = new PrismaClient().palabra;

  public async register( registerWordDto: RegisterWordDto ): Promise<WordEntity> {
    const wordCreated = await this.prisma.create({ 
      data: {
        palabra: registerWordDto.word,
        dificultad: registerWordDto.difficulty
      }
    });
    if( !wordCreated ) throw CustomError.badRequest('word not created');
    const wordEntity = WordEntity.fromJson(wordCreated);
    return wordEntity;
  }

  public async getByDifficulty( difficulty: string ): Promise<WordEntity[]> {
    if(!WordEntity.isValidDifficulty(difficulty)) throw CustomError.badRequest(`Invalid difficulty, valid values: ${WordEntity.validDifficulty}`);
    const wordsFound = await this.prisma.findMany({
      where: {
        dificultad: difficulty
      }
    });
    if (!wordsFound) throw CustomError.badRequest('Words not found');
    const wordsEntity = wordsFound.map( word => WordEntity.fromJson(word));
    return wordsEntity;
  }


}