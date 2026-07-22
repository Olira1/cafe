import { getSingle, setSingle } from '../utils/storage';
import { DEFAULT_SETTINGS } from '../data/defaultData';

const KEY = 'rms_settings';

export const settingsService = {
  get: () => getSingle<any>(KEY) || DEFAULT_SETTINGS,
  update(data: any) { setSingle(KEY, { ...(getSingle<any>(KEY) || DEFAULT_SETTINGS), ...data }); },
};
