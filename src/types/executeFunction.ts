export type ExecuteFunctionRequest<FP = undefined> = {
  FunctionName: string;
  FunctionParams?: FP;
};

export type ExecuteFunctionResponse<FR> = {
  FunctionResult: FR;
};
