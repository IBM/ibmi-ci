import { IBMi } from "../connection/IBMi";
import { ConnectStep } from "./actions/connect";
import { EnvironmentStep } from "./actions/env";
import { StepI } from "./step";

interface ExecutorEvents {
  log?: (value: string) => void;
}

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

	private steps: StepI[] = [
		new ConnectStep(),
		new EnvironmentStep(),
	];

  constructor() {}

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

  async executeSteps(events: ExecutorEvents = {}): Promise<ExecutorResult> {
    let allOutput = ``;
    const log = (value: string) => {
      if (events.log) {
        events.log(value);
      } else {
        console.log(value);
      }

      allOutput += (value + `\n`);
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
          const result = await step.execute();
  
          if (!result) {
            log(`Failed to execute step: ${step.id}`);
            shouldExit = true;
          }
        } catch (e) {
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