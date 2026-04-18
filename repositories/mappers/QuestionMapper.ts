import { Question as QuestionEntity } from '../../services/entities/Question';
import type { Question as QuestionDTO } from '../../types';

export class QuestionMapper {
    static toDomain(dto: QuestionDTO): QuestionEntity {
        return new QuestionEntity(
            dto.id,
            dto.text,
            dto.options,
            dto.correctAnswer,
            dto.explanation,
            dto.category,
            dto.difficulty
        );
    }

    static toDTO(entity: QuestionEntity): QuestionDTO {
        return {
            id: entity.id,
            text: entity.text,
            options: entity.options,
            correctAnswer: entity.correctAnswer,
            explanation: entity.explanation,
            category: entity.category,
            difficulty: entity.difficulty,
        };
    }

    static toDomainList(dtos: QuestionDTO[]): QuestionEntity[] {
        return dtos.map(dto => this.toDomain(dto));
    }
}
