import { Difficulty, WordEntity } from "../entities/word";

export class UpdateWordDto {
  constructor(
    public readonly word?: string,
    public readonly difficulty?: Difficulty,
  ){}

  static create( props: {[key: string]: any} ): [ string?, UpdateWordDto? ] {
    const { word, difficulty } = props;
    if (word && typeof word !== 'string') return ['word must be a string'];
    if (difficulty && typeof difficulty !== 'string' ) return ['difficulty must be a string'];
    if (!WordEntity.isValidDifficulty(difficulty)) return [`Invalid difficulty, valid values: ${WordEntity.validDifficulty}`];
    return [undefined, new UpdateWordDto( word, difficulty )];
  }
}