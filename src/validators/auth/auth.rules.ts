import { fieldStringChain, phoneNumberChain } from "../common-validation-rules";


export const registerUserValidationRule = [
  fieldStringChain("Name", "name"),
  fieldStringChain("Email", "email"),
  phoneNumberChain("phone_number"),
  fieldStringChain("Country", "country"),
  fieldStringChain("Company Code", "company_code"),
];

