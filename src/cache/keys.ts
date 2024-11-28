export enum Key {
  ACTIVITIES_LATEST = 'ACTIVITIES_LATEST',
}

export enum DynamicKey {
  ACTIVITIES_SIMILAR = 'ACTIVITIES_SIMILAR',
  ACTIVITY = 'ACTIVITY',
}

export type DynamicKeyType = `${DynamicKey}_${string}`;

export function getDynamicKey(key: DynamicKey, suffix: string) {
  const dynamic: DynamicKeyType = `${key}_${suffix}`;
  return dynamic;
}
