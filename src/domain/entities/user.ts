import { CustomError } from "../errors/custom-error";
export class UserEntity {
    constructor(
      public readonly nombre: string,
      public readonly apellidos: string,
      public readonly direccion: string,
      public readonly localidad: string,
      public readonly municipio: string,
    ){}
  
  
    static fromJson( props: {[key: string]: any} ): UserEntity { //uso de tuplas para retornar un error o un objeto
      const { nombre, apellidos, direccion, localidad, municipio} = props;

      if( typeof nombre !== 'string' ) throw CustomError.badRequest('name must be a string');
      if( typeof apellidos !== 'string' ) throw CustomError.badRequest('apellidos must be a string');
      if( typeof direccion !== 'string' ) throw CustomError.badRequest('direccion must be a string');
      if( typeof localidad !== 'string' ) throw CustomError.badRequest('localidad must be a number');
      if( typeof municipio !== 'string' ) throw CustomError.badRequest('municipio must be a string');
  
      return new UserEntity( nombre, apellidos, direccion, localidad, municipio );
    }
}