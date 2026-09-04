export interface PublicBuildConfig {
  selfHosted: boolean;
  storageFixedQuota?: number;
  translationFixedQuota?: number;
}

const parsePositiveInteger = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
};

export const getPublicBuildConfig = (): PublicBuildConfig => ({
  selfHosted: process.env['NEXT_PUBLIC_SELF_HOSTED'] === 'true',
  storageFixedQuota: parsePositiveInteger(process.env['NEXT_PUBLIC_STORAGE_FIXED_QUOTA']),
  translationFixedQuota: parsePositiveInteger(process.env['NEXT_PUBLIC_TRANSLATION_FIXED_QUOTA']),
});

export const getPublicBuildConfigMarker = (): string => {
  const config = getPublicBuildConfig();
  return [
    config.selfHosted ? 'self-hosted' : 'managed',
    `storage=${config.storageFixedQuota ?? 'default'}`,
    `translation=${config.translationFixedQuota ?? 'default'}`,
  ].join(';');
};
