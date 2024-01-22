import { Dree } from "dree"

export type ModifiedDree<T extends Dree> = { uuid: string } & { [K in keyof T]:
    K extends "children" ? ModifiedDreeProps<T[K]> : T[K]
  }
  
  type ModifiedDreeProps<T> = { [K in keyof T]:
    T[K] extends Dree ? ModifiedDree<T[K]> : T[K]
  }