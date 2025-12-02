import { SetMetadata } from "@nestjs/common";
import { META } from '../constants';

export const Public = () => SetMetadata(META.IS_PUBLIC, true);
