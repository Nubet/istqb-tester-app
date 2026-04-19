import { storage } from '@/infra/storage';
import { QuestionRepository } from './implementations/QuestionRepository';
import { ExamSessionRepository } from './implementations/ExamSessionRepository';
import { UserProgressRepository } from './implementations/UserProgressRepository';
import { GlossaryRepository } from './implementations/GlossaryRepository';

export const questionRepository = new QuestionRepository();
export const examSessionRepository = new ExamSessionRepository(storage);
export const userProgressRepository = new UserProgressRepository(storage);
export const glossaryRepository = new GlossaryRepository();
