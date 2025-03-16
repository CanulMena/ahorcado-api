import { Difficulty, WordEntity } from "../entities/word";

export class RegisterWordDto {
  constructor(
    public readonly word: string,
    public readonly difficulty: Difficulty,
  ){}

  static create( props: {[key: string]: any} ): [ string?, RegisterWordDto? ] {
    const { word, difficulty } = props;
    if (!word) return ['Missing word'];
    if (!difficulty) return ['Missing difficulty'];
    if (!WordEntity.isValidDifficulty(difficulty)) return [`Invalid difficulty, valid values: ${WordEntity.validDifficulty}`];
    return [undefined, new RegisterWordDto( word, difficulty )];
  }
}