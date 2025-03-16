
const validDifficulty = ['FACIL', 'MEDIO', 'DIFICIL'] as const;

export type Difficulty = typeof validDifficulty[number];

export class WordEntity {
  public static readonly validDifficulty = validDifficulty;
  constructor(
    public readonly id: number,
    public readonly word: string,
    public readonly difficulty: Difficulty,
  ){}

  public static isValidDifficulty(difficulty: any): difficulty is Difficulty {
    return WordEntity.validDifficulty.includes(difficulty);
  }

  static fromJson(props: {[key: string]: any}): WordEntity {
    const { dificultad, id, palabra } = props;

    if(!id) throw new Error('Missing id');
    if(!palabra) throw new Error('Missing palabra');
    if(!dificultad) throw new Error('Missing dificultad');
    if(!WordEntity.isValidDifficulty(dificultad)) throw new Error('Invalid difficulty');

    return new WordEntity(id, palabra, dificultad);
  }

}