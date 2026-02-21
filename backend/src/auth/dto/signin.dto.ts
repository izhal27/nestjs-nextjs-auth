import { OmitType, PartialType } from "@nestjs/mapped-types";

import { SignupDto } from "./signup.dto";

export class SigninDto extends PartialType(OmitType(SignupDto, ['name'] as const)) { }