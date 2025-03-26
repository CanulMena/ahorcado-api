import nspell from 'nspell';
import { readFileSync } from 'fs';

// Cargar los archivos del diccionario
const dicPath = require.resolve('dictionary-es/index.aff');
const dicData = readFileSync(dicPath, 'utf-8');
const dicWordPath = require.resolve('dictionary-es/index.dic');
const dicWordData = readFileSync(dicWordPath, 'utf-8');

// Crear la instancia del corrector ortográfico
const spellChecker = nspell(dicData, dicWordData);

/**
 * Verifica si una palabra existe en el diccionario español.
 * @param word Palabra a validar
 * @returns `true` si la palabra existe en el diccionario, `false` si no.
 */
export function isValidWord(word: string): boolean {
  return spellChecker.correct(word.toLowerCase());
}
