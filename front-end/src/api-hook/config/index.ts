import axios from "axios";
import ky, { HTTPError, TimeoutError } from "ky";

export interface ApiError {
    message: string;
    type?: string;
    statusCode?: number;
    errors?: { [key: string]: string };
  }
  
  export interface ApiResult<T> {
    data: T;
    message?: string;
  }
  export interface MessageResult {
    message: string;
  }

const config = {
  prefixUrl: "http://localhost:5000/", // Ganti dengan URL API
  timeout: 10000, // 10 detik
  headers: {
    Accept: "application/json",
    "Accept-Language": "id",
  },
};

export const client = ky.create(config);

export default async function toApiError(error: Error): Promise<ApiError> {
    const mError: ApiError = {
      message: error.message,
    };
  
    if (error instanceof HTTPError) {
      mError.message = error.message;
      try {
        const body = await error.response.json();
        mError.message = body.message;
        mError.statusCode = body.statusCode;
        mError.errors = body.errors;
      } catch {}
    } else if (error instanceof TimeoutError) {
      mError.message = "Looks like the server is taking too long to respond";
    } else {
      if (error.message === "Network request failed") {
        mError.message =
          "Looks like there is problem with the internet connection";
      }
    }
    return mError;
  }

  export enum FilterType {
    Text = "test",
    Number = "number",
    Option = "option",
    Date = "date",
  }
  
  export enum FilterBehaviour {
    Exact = "exact",
    Partial = "partial",
    Range = "range",
    Single = "single",
    Multitple = "multiple",
    Before = "before",
    After = "after",
  }
  
  export interface Option {
    label: string;
    value: string;
  }
  
  export interface Filter {
    name: string;
    label: string;
    type: string;
    options?: Option[];
    behaviour: FilterBehaviour;
    value?: string;
  }
  
  export interface Sort {
    options: string[];
    default: string;
    value?: string;
  }
  
  export interface PaginationMeta {
    currentPage: number;
    from: number;
    lastPage: number;
    path: string;
    perPage: number;
    to: number;
    total: number;
  }
  
  export interface getEnumsInput {
    class: string;
  }
  
  export interface EnumResult {
    label: string;
    value: string;
  }
  

  export interface ExtendedApiResult<T> extends ApiResult<T> {
    meta: PaginationMeta;
    filters: Filter[];
    sorts: Sort;
    header?: unknown[];
  }


  export const apiClient = axios.create({
    baseURL: "http://localhost:5000/", // Ganti dengan domain API kamu
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  
