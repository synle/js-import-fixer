declare global {
  var countLibUsedByFile: Record<string, number>;

  interface String {
    blue(): string;
    yellow(): string;
    green(): string;
    red(): string;
  }
}

export {};
