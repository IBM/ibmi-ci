
export class StepI {
  parameters: string[] = [];
  constructor(public name: string, public description: string) {}

  addParameter(value: string) {
    this.parameters.push(value);
  }

  async execute(): Promise<boolean> {return false};
}