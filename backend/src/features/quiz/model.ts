import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType = 'MCQ' | 'Boolean' | 'text';

export interface IQuestion {
  type: QuestionType;
  question: string;
  options?: string[] | boolean[] | string;
  answer: string | boolean;
}

export interface IQuiz extends Document {
  title: string;
  questions: IQuestion[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: ['MCQ', 'Boolean', 'text'],
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
    },
    options: {
      type: Schema.Types.Mixed,
      required: false,
    },
    answer: {
      type: Schema.Types.Mixed,
      required: [true, 'Answer is required'],
    },
  },
  { _id: false }
);

const quizSchema = new Schema<IQuiz>(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
    },
    questions: {
      type: [questionSchema],
      required: [true, 'Quiz must have at least one question'],
      validate: {
        validator: (questions: IQuestion[]) => questions.length > 0,
        message: 'Quiz must have at least one question',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);

export default Quiz;

