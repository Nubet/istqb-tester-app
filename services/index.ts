import { ExamService } from './ExamService';
import { LearningService } from './LearningService';
import { ProgressService } from './ProgressService';
import { BookmarkService } from './BookmarkService';
import { GlossaryService } from './implementations/GlossaryService';

export const examService = new ExamService();
export const learningService = new LearningService();
export const progressService = new ProgressService();
export const bookmarkService = new BookmarkService();
export const glossaryService = new GlossaryService();
