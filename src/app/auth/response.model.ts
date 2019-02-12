export interface SignUpResponse {
  error: boolean;
  message: string;
  data?: {[key: string]: any};
  errorCode?: string;
  errorType?: string;
}
