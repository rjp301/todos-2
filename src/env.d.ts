/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    isGripper?: boolean;
  }
}

declare namespace App {
  interface Locals {
    session: import("lucia").Session | null;
    user: import("lucia").User | null;
  }
}
