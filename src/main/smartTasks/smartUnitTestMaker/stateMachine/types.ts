// src/main/smartTasks/smartUnitTestMaker/stateMachine/types.ts

import {
  StatesConfig,
  ProvidedActor,
} from 'xstate';
import { TestMakerContext, TestMakerEvent } from '../types';

// Relax the action type.
export type ActionTypes = any;

// Define guard types as a union.
export type GuardTypes =
  | { type: 'testPassed'; params: unknown }
  | { type: 'maxRetriesReached'; params: unknown };

/**
 * Our machine’s state configuration type.
 * Here we specify TActor = ProvidedActor.
 */
export type TestMakerStates = StatesConfig<
  TestMakerContext,      // TContext
  TestMakerEvent,        // TEvent (ensure this union is consistent everywhere)
  ProvidedActor,         // TActor now is ProvidedActor (so our actor objects must include a src and logic)
  any,                   // TAction (here relaxed to any)
  GuardTypes,            // TGuard
  string,                // TDelay
  string,                // TTag
  unknown,               // TOutput
  TestMakerEvent,        // TEmitted (should match your event union)
  Record<string, unknown> // TMeta
>;
