/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    isGripper?: boolean;
  }
}
