
export class RegisterGameDto {
  constructor(
    public userId: number, //Identificador unico del usuario
    public wordId: number, //Identificador unico de la palabra
    public attemptsMade: number, //Número de intentos usados
    public maximumNumberAttempts: number, //Número máximo de intentos permitidos
  ){}

  static create( props: {[key: string]: any} ): [ string?, RegisterGameDto? ] { //uso de tuplas para retornar un error o un objeto
    const { userId, wordId, attemptsMade, maximumNumberAttempts } = props;
    if (!userId) return ['Missing userId'];
    if (!wordId) return ['Missing wordId'];
    if (!attemptsMade) return ['Missing attemptsMade'];
    if (!maximumNumberAttempts) return ['Missing maximumNumberAttempts'];
    return [undefined, new RegisterGameDto( userId, wordId, attemptsMade, maximumNumberAttempts )];
  }

}