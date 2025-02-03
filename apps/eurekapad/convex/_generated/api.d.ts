/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ai from "../ai.js";
import type * as clerk from "../clerk.js";
import type * as documentPermissions from "../documentPermissions.js";
import type * as documents from "../documents.js";
import type * as emails_actions from "../emails/actions.js";
import type * as emails_share from "../emails/share.js";
import type * as emails_signup from "../emails/signup.js";
import type * as http from "../http.js";
import type * as migrations from "../migrations.js";
import type * as speech from "../speech.js";
import type * as uploads from "../uploads.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ai: typeof ai;
  clerk: typeof clerk;
  documentPermissions: typeof documentPermissions;
  documents: typeof documents;
  "emails/actions": typeof emails_actions;
  "emails/share": typeof emails_share;
  "emails/signup": typeof emails_signup;
  http: typeof http;
  migrations: typeof migrations;
  speech: typeof speech;
  uploads: typeof uploads;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
