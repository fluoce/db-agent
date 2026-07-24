import { SetMetadata } from '@nestjs/common';

export const SKIP_RATE_LIMIT_BY_IP = 'skipRateLimitByIp';

export const SkipRateLimitByIp = () =>
    SetMetadata(SKIP_RATE_LIMIT_BY_IP, true);