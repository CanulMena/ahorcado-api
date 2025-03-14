

export class RegisterUserDto {

  constructor(
    public readonly name: string,
    public readonly apellidos: string,
    public readonly direccion: string,
    public readonly localidad: string,
    public readonly municipio: string,
  ){}


  static create( props: {[key: string]: any} ): [ string?, RegisterUserDto? ] { //uso de tuplas para retornar un error o un objeto
    const { nombre, apellidos, direccion, localidad, municipio} = props;
    //quiero validar que name no sea un falsy o no un string. ayudame con esa validación: 
    if (typeof nombre !== 'string') return ['name must be a string'];
    if (typeof apellidos !== 'string') return ['apellidos must be a string'];
    if (typeof direccion !== 'string') return ['direccion must be a string'];
    if (typeof localidad !== 'string') return ['localidad must be a number'];
    if (typeof municipio !== 'string') return ['municipio must be a string'];

    return [undefined, new RegisterUserDto( nombre, apellidos, direccion, localidad, municipio )];
  }
}