export type ExecuteFunctionRequest<FP = undefined> = DeepReadonly<{
  FunctionName: string;
  FunctionParams?: FP;
}>;

export type ExecuteFunctionResponse<FR> = DeepReadonly<{
  FunctionResult: FR;
}>;
