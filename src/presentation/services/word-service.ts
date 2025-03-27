import { Prisma, PrismaClient } from "@prisma/client";
import { WordEntity } from "../../domain/entities/word";
import { CustomError } from "../../domain/errors/custom-error";
import { RegisterWordDto } from "../../domain/dtos/register-word.dto";
import { UpdateWordDto } from '../../domain/dtos/update-word.dto';
import { WiktionaryDatasource } from "../../infrastructure/wiktionary.datasource";

export class WordService {
  constructor(){}

  private readonly prisma = new PrismaClient().palabra;

  public async register( registerWordDto: RegisterWordDto ): Promise<WordEntity> {
    try {
      const wordExists: boolean = await WiktionaryDatasource.consultarWiktionary(registerWordDto.word);
      if (!wordExists) throw CustomError.badRequest('la palabra no existe');

      const wordCreated = await this.prisma.create({ 
        data: {
          palabra: registerWordDto.word,
          dificultad: registerWordDto.difficulty
        }
      });
      
      if( !wordCreated ) throw CustomError.badRequest('palabra no creada');
      const wordEntity = WordEntity.fromJson(wordCreated);
      return wordEntity;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw CustomError.badRequest(`La ${error.meta?.target} ya existe`);
        }
      }
      throw error
    }
  }

  public async getByDifficulty( difficulty: string ): Promise<WordEntity[]> {
    if(!WordEntity.isValidDifficulty(difficulty)) throw CustomError.badRequest(`Invalid difficulty, valid values: ${WordEntity.validDifficulty}`);
    const wordsFound = await this.prisma.findMany({
      where: {
        dificultad: difficulty
      }
    });
    if (!wordsFound) throw CustomError.badRequest('palabras no encontradas');
    const wordsEntity = wordsFound.map((word: { id: number; palabra: string; dificultad: string }) => WordEntity.fromJson(word));
    return wordsEntity;
  }

  public async getAll(): Promise<WordEntity[]> {
    const wordsFound = await this.prisma.findMany();
    if (!wordsFound) throw CustomError.badRequest('palabras no encontradas');
    const wordsEntity = wordsFound.map((word: { id: number; palabra: string; dificultad: string }) => WordEntity.fromJson(word));
    return wordsEntity;
  }

  public async getById( id: number ): Promise<WordEntity> {
    const wordFound = await this.prisma.findUnique({
      where: {
        id: id
      }
    });
    if (!wordFound) throw CustomError.badRequest('palabra no encontrada');
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
    if( !wordUpdated ) throw CustomError.badRequest('palabra no actualizada');
    const wordEntity = WordEntity.fromJson(wordUpdated);
    return wordEntity;
  }


}