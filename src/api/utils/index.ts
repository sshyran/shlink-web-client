import { AxiosError } from 'axios';
import {
  ErrorTypeV2,
  ErrorTypeV3,
  InvalidArgumentError,
  InvalidShortUrlDeletion,
  ProblemDetailsError,
  RegularNotFound,
} from '../types/errors';

const isAxiosError = (e: unknown): e is AxiosError<ProblemDetailsError> => !!e && typeof e === 'object' && 'response' in e;

export const parseApiError = (e: unknown): ProblemDetailsError | undefined => (
  isAxiosError(e) ? e.response?.data : undefined
);

export const isInvalidArgumentError = (error?: ProblemDetailsError): error is InvalidArgumentError =>
  error?.type === ErrorTypeV2.INVALID_ARGUMENT || error?.type === ErrorTypeV3.INVALID_ARGUMENT;

export const isInvalidDeletionError = (error?: ProblemDetailsError): error is InvalidShortUrlDeletion =>
  error?.type === 'INVALID_SHORTCODE_DELETION'
  || error?.type === ErrorTypeV2.INVALID_SHORT_URL_DELETION
  || error?.type === ErrorTypeV3.INVALID_SHORT_URL_DELETION;

export const isRegularNotFound = (error?: ProblemDetailsError): error is RegularNotFound =>
  (error?.type === ErrorTypeV2.NOT_FOUND || error?.type === ErrorTypeV3.NOT_FOUND) && error?.status === 404;
