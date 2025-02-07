// src/main/smartTasks/smartUnitTestMaker/stateMachine/states/handlingFailure.ts
import { assign } from 'xstate';
import { States } from '../constants';
import type { TestMakerContext, TestMakerEvent } from '../../types';
import { MachineActors } from 'src/main/smartTasks/smartUnitTestMaker/stateMachine/types'

export const handlingFailure = {
  entry: assign<TestMakerContext, TestMakerEvent, undefined, TestMakerEvent, MachineActors>({
    retries: ({ context }) => context.retries + 1,
  }),
  always: [
    {
      target: States.failure,
      guard: ({ context }: { context: TestMakerContext }) =>
        context.retries >= context.maxRetries,
    } as const,
    {
      target: States.fixingTest
    } as const
  ]
} as const;
