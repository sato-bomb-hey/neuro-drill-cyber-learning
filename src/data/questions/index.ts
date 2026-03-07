import type { Question } from '../../types/game'

import { mathChu1FirstQuestions } from './mathChu1FirstQuestions'
import { mathChu1SecondQuestions } from './mathChu1SecondQuestions'
import { mathChu2FirstQuestions } from './mathChu2FirstQuestions'
import { mathChu2SecondQuestions } from './mathChu2SecondQuestions'
import { mathChu3FirstQuestions } from './mathChu3FirstQuestions'
import { mathChu3SecondQuestions } from './mathChu3SecondQuestions'

import { englishChu1FirstQuestions } from './englishChu1FirstQuestions'
import { englishChu1SecondQuestions } from './englishChu1SecondQuestions'
import { englishChu2FirstQuestions } from './englishChu2FirstQuestions'
import { englishChu2SecondQuestions } from './englishChu2SecondQuestions'
import { englishChu3FirstQuestions } from './englishChu3FirstQuestions'
import { englishChu3SecondQuestions } from './englishChu3SecondQuestions'

import { japaneseChu1FirstQuestions } from './japaneseChu1FirstQuestions'
import { japaneseChu1SecondQuestions } from './japaneseChu1SecondQuestions'
import { japaneseChu2FirstQuestions } from './japaneseChu2FirstQuestions'
import { japaneseChu2SecondQuestions } from './japaneseChu2SecondQuestions'
import { japaneseChu3FirstQuestions } from './japaneseChu3FirstQuestions'
import { japaneseChu3SecondQuestions } from './japaneseChu3SecondQuestions'

import { scienceChu1FirstQuestions } from './scienceChu1FirstQuestions'
import { scienceChu1SecondQuestions } from './scienceChu1SecondQuestions'
import { scienceChu2FirstQuestions } from './scienceChu2FirstQuestions'
import { scienceChu2SecondQuestions } from './scienceChu2SecondQuestions'
import { scienceChu3FirstQuestions } from './scienceChu3FirstQuestions'
import { scienceChu3SecondQuestions } from './scienceChu3SecondQuestions'

import { socialChu1FirstQuestions } from './socialChu1FirstQuestions'
import { socialChu1SecondQuestions } from './socialChu1SecondQuestions'
import { socialChu2FirstQuestions } from './socialChu2FirstQuestions'
import { socialChu2SecondQuestions } from './socialChu2SecondQuestions'
import { socialChu3FirstQuestions } from './socialChu3FirstQuestions'
import { socialChu3SecondQuestions } from './socialChu3SecondQuestions'

export const questions: Question[] = [
  ...mathChu1FirstQuestions,
  ...mathChu1SecondQuestions,
  ...mathChu2FirstQuestions,
  ...mathChu2SecondQuestions,
  ...mathChu3FirstQuestions,
  ...mathChu3SecondQuestions,
  ...englishChu1FirstQuestions,
  ...englishChu1SecondQuestions,
  ...englishChu2FirstQuestions,
  ...englishChu2SecondQuestions,
  ...englishChu3FirstQuestions,
  ...englishChu3SecondQuestions,
  ...japaneseChu1FirstQuestions,
  ...japaneseChu1SecondQuestions,
  ...japaneseChu2FirstQuestions,
  ...japaneseChu2SecondQuestions,
  ...japaneseChu3FirstQuestions,
  ...japaneseChu3SecondQuestions,
  ...scienceChu1FirstQuestions,
  ...scienceChu1SecondQuestions,
  ...scienceChu2FirstQuestions,
  ...scienceChu2SecondQuestions,
  ...scienceChu3FirstQuestions,
  ...scienceChu3SecondQuestions,
  ...socialChu1FirstQuestions,
  ...socialChu1SecondQuestions,
  ...socialChu2FirstQuestions,
  ...socialChu2SecondQuestions,
  ...socialChu3FirstQuestions,
  ...socialChu3SecondQuestions,
] as Question[]

export function getQuestions(
  subject: string,
  grade: string,
  term: string,
  count = 10
): Question[] {
  const filtered = questions.filter(
    (q) => q.subject === subject && q.grade === grade && q.term === term
  )
  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
