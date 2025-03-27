import axios from "axios";
import { CustomError } from "../domain/errors/custom-error";

export class WiktionaryDatasource {

  // Función para remover tildes y caracteres especiales
  static normalizarTexto(texto: string): string {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Función para consultar la API de Wiktionary
  static async consultarWiktionary(palabra: string): Promise<boolean> {
    try {
      const palabraNormalizada = this.normalizarTexto(palabra.toLowerCase());
  
      const response = await axios.get("https://es.wiktionary.org/w/api.php", {
        params: {
          action: "query",
          titles: palabraNormalizada,
          format: "json"
        },
        timeout: 5000, // Espera un máximo de 5 segundos
      });
  
      // Si la palabra no existe, Wiktionary devuelve un ID "-1"
      return !Object.keys(response.data.query.pages).includes("-1");
    } catch (error) {
      return false; // Indica que hubo un error en la API
    }
  }
  

}
