
import { CustomError } from "../errors/custom-error";

export class GameEntity {
  constructor(
    public id: number, //Identificador unico del juego
    public usuarioId: number, //Identificador unico del usuario
    public palabraId: number, //Identificador unico de la palabra
    public puntuacion: number, //Puntuación obtenida en el juego
    public intentosUsados: number, //Número de intentos usados
    public maximumNumberAttempts: number, //Número máximo de intentos permitidos
    public creadaEn: Date //Fecha de creación del juego
  ){}

  static fromJson( props: {[key: string]: any} ): GameEntity { //uso de tuplas para retornar un error o un objeto
    const {  
      id,
      usuarioId,
      palabraId,
      puntuacion,
      intentosUsados,
      intentosMaximos,
      creadaEn } = props;

      if(!id) throw CustomError.badRequest('Missing id');
      if(!usuarioId) throw CustomError.badRequest('Missing usuarioId');
      if(!palabraId) throw CustomError.badRequest('Missing palabraId');
      if(!puntuacion) throw CustomError.badRequest('Missing puntuacion');
      if(!intentosUsados) throw CustomError.badRequest('Missing intentosUsados');
      if(!intentosMaximos) throw CustomError.badRequest('Missing intentosMaximos,');
      if(!creadaEn) throw CustomError.badRequest('Missing creadaEn');

    return new GameEntity(
      id, 
      usuarioId, 
      palabraId, 
      puntuacion, 
      intentosUsados,
      intentosMaximos,
      creadaEn );
  }
}