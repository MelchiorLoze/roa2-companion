export type ExecuteFunctionRequest<FP> = {
  FunctionName: string;
  FunctionParams: FP;
};

export type ExecuteFunctionResponse<FR> = {
  data: { FunctionResult: FR };
};
