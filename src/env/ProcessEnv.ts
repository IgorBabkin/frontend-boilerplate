import { z } from 'zod';
import { IEnv, LogLevel, PlayMode } from './IEnv';

const schema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_LOG_LEVEL: z.nativeEnum(LogLevel),
  VITE_PLAY_MODE: z.nativeEnum(PlayMode),
});

export class ProcessEnv implements IEnv {
  static parse(data: unknown): ProcessEnv {
    return new ProcessEnv(schema.parse(data));
  }

  public apiBaseUrl: string;
  public logLevel: LogLevel;
  public playMode: PlayMode;

  constructor(props: z.infer<typeof schema>) {
    this.apiBaseUrl = props.VITE_API_BASE_URL;
    this.logLevel = props.VITE_LOG_LEVEL;
    this.playMode = props.VITE_PLAY_MODE;
  }
}
