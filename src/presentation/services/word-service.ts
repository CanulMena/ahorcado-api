import { PrismaClient } from "@prisma/client";
import { WordEntity } from "../../domain/entities/word";
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterWordDto } from "../../domain/dtos/register-word.dto";
import { UpdateWordDto } from '../../domain/dtos/update-word.dto';

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
    const wordsEntity = wordsFound.map((word: { id: number; palabra: string; dificultad: string }) => WordEntity.fromJson(word));
    return wordsEntity;
  }

  public async getAll(): Promise<WordEntity[]> {
    const wordsFound = await this.prisma.findMany();
    if (!wordsFound) throw CustomError.badRequest('Words not found');
    const wordsEntity = wordsFound.map((word: { id: number; palabra: string; dificultad: string }) => WordEntity.fromJson(word));
    return wordsEntity;
  }

  public async getById( id: number ): Promise<WordEntity> {
    const wordFound = await this.prisma.findUnique({
      where: {
        id: id
      }
    });
    if (!wordFound) throw CustomError.badRequest('Word not found');
    const wordEntity = WordEntity.fromJson(wordFound);
    return wordEntity;
  }

  public async update( id: number, updateWordDto: UpdateWordDto ): Promise<WordEntity> {

    this.getById(id);

    const wordUpdated = await this.prisma.update({
      where: {
        id: id
      },
      data: {
        palabra: updateWordDto.word,
        dificultad: updateWordDto.difficulty
      }
    });
    if( !wordUpdated ) throw CustomError.badRequest('word not updated');
    const wordEntity = WordEntity.fromJson(wordUpdated);
    return wordEntity;
  }


}