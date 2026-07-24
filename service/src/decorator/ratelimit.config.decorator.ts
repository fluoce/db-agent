import { SetMetadata } from '@nestjs/common';
import { RateLimitConfigInterface } from 'src/types/ratelimit.types';

export const RATE_LIMIT_CONFIG = 'rate_limit_config';

export const RateLimitConfig = (config: RateLimitConfigInterface) =>
  SetMetadata(RATE_LIMIT_CONFIG, config);
