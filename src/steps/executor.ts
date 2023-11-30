import { IBMi } from "../connection/IBMi";
import { StepI } from "./step";

export type LoggerFunction = (value: string, append?: boolean) => void;

interface ExecutorResult {
  code: number;
  output: string;
}

export interface ExecutorState {
  connection: IBMi|undefined;
  lcwd: string;
  rcwd: string;
}

export class Executor {
  private state: ExecutorState = {
    connection: new IBMi(),
    lcwd: process.cwd(),
    rcwd: `.`
  }

	private steps: StepI[] = [];

  constructor() {}

  setConnection(connection: IBMi) {
    this.state.connection = connection;
  }

  addSteps(...steps: StepI[]) {
    this.steps.push(...steps);
  }

  getLastStep(): StepI|undefined {
    return this.steps[this.steps.length - 1];
  }

  getSteps(): StepI[] {
    return this.steps;
  }

  getInvalidSteps(): StepI[] {
    let invalidSteps: StepI[] = [];
  
    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
  
      if (!step.validateParameters()) {
        invalidSteps.push(step);
      }
    }
  
    return invalidSteps;
  }

  dispose() {
    this.state.connection?.end();
  }

  async executeSteps(events: {log?: LoggerFunction} = {}): Promise<ExecutorResult> {
    let allOutput = ``;

    // Custom log function so we can collect all the output too
    const log: LoggerFunction = (value: string, append?: boolean) => {
      if (events.log) events.log(value, append);
      allOutput += (value + (append ? `` : `\n`));
    }

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i];
      let shouldExit = false;
  
      log(``);
      log(`==========================================`);
      log(`Executing step ${i + 1}: ${step.id}`);
      log(`==========================================`);
      log(``);
  
      if (step.validateParameters()) {
        try {
          step.setState(this.state);
          step.setLogger(log);

          const result = await step.execute();
  
          if (!result) {
            log(`Failed to execute step: ${step.id}`);
            shouldExit = true;
          }
        } catch (e: any) {
          log(`Failed to execute step: ${step.id}`);
          log(e.message);
          shouldExit = true;
        }
  
        if (shouldExit) {
          // Step errors can be ignored with the `--ignore` flag
          if (step.ignoreStepError()) {
            log(`Ignoring error for this step.`);
          } else {
            return {
              code: 1,
              output: allOutput
            };
          }
        }
  
      } else {
        log(`Runtime error, which is odd because the validation should have caught it!`);
        log(`Invalid parameters for step: ${step.id}`);
        return {
          code: 0,
          output: allOutput
        };
      }
    }
  
    return {
      code: 0,
      output: allOutput
    };
  }
}