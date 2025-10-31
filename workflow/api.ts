export async function start(workflow: Function, args: any[]) {
  // Simple workflow starter - execute the workflow function
  return await workflow(...args);
}
