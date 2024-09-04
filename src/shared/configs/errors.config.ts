import { HttpStatus } from '@nestjs/common';

enum ServerErrorType {
  GIVEN_INPUT_IS_INVALID,
  PROPERTY_IS_MISSING,
  RECORD_IS_MISSING,
  AN_UNKNOWN_ERROR_IS_OCCURRED,

  LOAD_OPTIONS_IS_INVALID,
  ORDER_OPTIONS_IS_INVALID,

  COULD_NOT_GET_MODULE,

  FILE_DELETING_IS_FAILED,
  FILE_UPLOADING_IS_FAILED,
  MEDIA_TYPE_IS_UNEXPECTED,
  MEDIA_TYPE_IS_UNSUPPORTED,

  CURRENT_PASSWORD_IS_WRONG,
  USER_IS_NOT_VERIFIED,
  PASSWORD_AND_CONFIRMATION_DO_NOT_MATCH,
  USER_CREDENTIALS_ARE_WRONG,
  USER_NOT_FOUND,
  TOKEN_NOT_VERIFIED,

  JSON_READ_FROM_FILE,
  ID_IS_INVALID,

  AGE_RESTRICTION,
  NOT_FOUND,
  INVALID_TICKET,
}

class ServerError extends Error {
  readonly name: string;
  readonly message: string;
  readonly statusCode: number = 400;

  constructor(type: ServerErrorType, ...args: string[]) {
    super();

    this.name = ServerErrorType[type];

    switch (type) {
      case ServerErrorType.INVALID_TICKET: {
        this.message = `Invalid Ticket`;
        this.statusCode = HttpStatus.FORBIDDEN;
        break;
      }

      case ServerErrorType.NOT_FOUND: {
        this.message = `${args[0]} not found`;
        this.statusCode = HttpStatus.NOT_FOUND;
        break;
      }

      case ServerErrorType.AGE_RESTRICTION: {
        this.message = `You must be ${args[0]} years old or above`;
        break;
      }

      case ServerErrorType.TOKEN_NOT_VERIFIED: {
        this.message = `Supplied token was not verified`;
        break;
      }

      case ServerErrorType.USER_NOT_FOUND: {
        this.message = `User not found`;
        break;
      }

      case ServerErrorType.GIVEN_INPUT_IS_INVALID: {
        this.message = `${args[0]}`;
        break;
      }
      case ServerErrorType.PROPERTY_IS_MISSING: {
        this.message = `"${args[0]}" is required.`;
        break;
      }
      case ServerErrorType.RECORD_IS_MISSING: {
        this.message = `There aren't any records with given information. ${args[0]}`;
        break;
      }
      case ServerErrorType.AN_UNKNOWN_ERROR_IS_OCCURRED: {
        this.message = `An unknown error is occured.`;
        this.statusCode = 500;
        break;
      }
      /** */
      case ServerErrorType.ID_IS_INVALID: {
        this.message = `"${args[0]} is not a valid id`;
        break;
      }

      case ServerErrorType.ORDER_OPTIONS_IS_INVALID: {
        this.message = `"${args[0]}" is not orderable.`;
        break;
      }

      case ServerErrorType.LOAD_OPTIONS_IS_INVALID: {
        this.message = `"${args[0]}" is not loadable.`;
        break;
      }

      case ServerErrorType.COULD_NOT_GET_MODULE: {
        this.message = `Could not get "${args[0]}" module from mms.`;
        break;
      }

      case ServerErrorType.FILE_DELETING_IS_FAILED: {
        this.message = `"${args[0]}" can not be deleted from storage server.`;
        break;
      }
      case ServerErrorType.FILE_UPLOADING_IS_FAILED: {
        this.message = `"${args[0]}" can not be uploaded to storage server.`;
        break;
      }
      case ServerErrorType.MEDIA_TYPE_IS_UNEXPECTED: {
        this.message = `"${args[0]}" is expected as media type, but "${args[1]}" is received.`;
        break;
      }
      case ServerErrorType.MEDIA_TYPE_IS_UNSUPPORTED: {
        this.message = `"${args[0]}" media type is not supported.`;
        this.statusCode = 415;
        break;
      }

      case ServerErrorType.CURRENT_PASSWORD_IS_WRONG: {
        this.message = `Given current password is wrong.`;
        break;
      }

      case ServerErrorType.USER_IS_NOT_VERIFIED: {
        this.message = `You are not a verified user. Only verified users can login.`;
        break;
      }
      case ServerErrorType.PASSWORD_AND_CONFIRMATION_DO_NOT_MATCH: {
        this.message = `Given password and password confirmation are mismatched.`;
        break;
      }
      case ServerErrorType.USER_CREDENTIALS_ARE_WRONG: {
        this.message = `Given username or password is wrong.`;
        break;
      }

      case ServerErrorType.JSON_READ_FROM_FILE: {
        this.message = `Failed to read JSON data from path: ${args[0]}`;
        break;
      }
    }
  }
}

export { ServerError, ServerErrorType };
