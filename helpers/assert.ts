export default function assert(condition: boolean, message: string = "assertion failed"): void {
  if (!condition) {
    throw new Error(message);
  }
}
