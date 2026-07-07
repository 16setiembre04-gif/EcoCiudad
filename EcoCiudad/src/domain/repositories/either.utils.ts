// Either utility functions

export const left = <L>(value: L): { left: L; right?: undefined } => ({ left: value });
export const right = <R>(value: R): { left?: undefined; right: R } => ({ right: value });
