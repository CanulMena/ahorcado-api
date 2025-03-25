import { PrismaClient } from "@prisma/client";
import { RegisterGameDto } from "../../domain/dtos/register-game.dto";
import { GameEntity } from "../../domain/entities/game";
import { CustomError } from "../../domain/errors/custom-error";

export class GameService {
  constructor(
  ){}
  private readonly prisma = new PrismaClient();

  public async register( registerGameDto: RegisterGameDto ): Promise<Omit<GameEntity, 'passwordHash'>> {

    // Obtener la palabra y su dificultad
    const palabra = await this.prisma.palabra.findUnique({
      where: { id: registerGameDto.wordId }
    });

    if (!palabra) throw CustomError.badRequest("palabra no encontrada");

    // Asignar bono base según la dificultad
    const basePoints = {
      FACIL: 100,
      MEDIO: 200,
      DIFICIL: 300
    };

    // Asegúrate de que palabra.dificultad sea del tipo correcto
    const difficulty = palabra.dificultad as keyof typeof basePoints;

    const points = basePoints[difficulty];

    // Calcular factor de intentos ajustado
    const T = Math.max(1 - ((registerGameDto.attemptsMade - 1) / registerGameDto.maximumNumberAttempts));

    // Calcular la puntuación final
    const score = Math.round(points * T); // Redondeamos para evitar decimales

    const gameCreated = await this.prisma.partida.create({ 
      data: {
        creadaEn: new Date(),
        intentosUsados: registerGameDto.attemptsMade,
        intentosMaximos: registerGameDto.maximumNumberAttempts,
        usuarioId: registerGameDto.userId,
        palabraId: registerGameDto.wordId,
        puntuacion: score
      }
    });
    
    if( !gameCreated ) throw CustomError.badRequest('partida no creada');
    const gameEntity = GameEntity.fromJson(gameCreated);
    return gameEntity;
  }

  public async GeneralRanking(): Promise<{
    generalRanking: {
      usuarioId: number;
      nombre: string;
      totalPuntos: number;
    }[]
  }> {
    const ranking = await this.prisma.partida.groupBy({
      by: ["usuarioId"],
      _sum: {
        puntuacion: true,
      },
      orderBy: {
        _sum: {
          puntuacion: "desc",
        },
      },
      take: 10, // Top 10 jugadores
    });
  
    // Obtener información de los usuarios
    const usuarios: {
      id: number;
      nombre: string;
    }[] 
    = await this.prisma.usuario.findMany({
      where: {
        id: { in: ranking.map((r: { usuarioId: number; _sum: { puntuacion: number | null } }) => r.usuarioId) },
      },
      select: {
        id: true,
        nombre: true,
      },
    });

    const generalRanking: {
      usuarioId: number;
      nombre: string;
      totalPuntos: number;
    }[] 
    = ranking.map((ranking: { usuarioId: number; _sum: { puntuacion: number | null } }) => ({
      usuarioId: ranking.usuarioId,
      nombre: usuarios.find((user) => user.id === ranking.usuarioId)?.nombre || "Desconocido",
      totalPuntos: ranking._sum.puntuacion || 0,
    }));

    return {
      generalRanking
    }
  
  }

}