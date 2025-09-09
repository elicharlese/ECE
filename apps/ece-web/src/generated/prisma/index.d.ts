
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Card
 * 
 */
export type Card = $Result.DefaultSelection<Prisma.$CardPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model TradeOffer
 * 
 */
export type TradeOffer = $Result.DefaultSelection<Prisma.$TradeOfferPayload>
/**
 * Model TradeOfferItem
 * 
 */
export type TradeOfferItem = $Result.DefaultSelection<Prisma.$TradeOfferItemPayload>
/**
 * Model AppOrder
 * 
 */
export type AppOrder = $Result.DefaultSelection<Prisma.$AppOrderPayload>
/**
 * Model OrderRevision
 * 
 */
export type OrderRevision = $Result.DefaultSelection<Prisma.$OrderRevisionPayload>
/**
 * Model OrderCommunication
 * 
 */
export type OrderCommunication = $Result.DefaultSelection<Prisma.$OrderCommunicationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TradeOfferStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

export type TradeOfferStatus = (typeof TradeOfferStatus)[keyof typeof TradeOfferStatus]


export const TradeOfferItemRole: {
  OFFERED: 'OFFERED',
  REQUESTED: 'REQUESTED'
};

export type TradeOfferItemRole = (typeof TradeOfferItemRole)[keyof typeof TradeOfferItemRole]

}

export type TradeOfferStatus = $Enums.TradeOfferStatus

export const TradeOfferStatus: typeof $Enums.TradeOfferStatus

export type TradeOfferItemRole = $Enums.TradeOfferItemRole

export const TradeOfferItemRole: typeof $Enums.TradeOfferItemRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.card`: Exposes CRUD operations for the **Card** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cards
    * const cards = await prisma.card.findMany()
    * ```
    */
  get card(): Prisma.CardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradeOffer`: Exposes CRUD operations for the **TradeOffer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradeOffers
    * const tradeOffers = await prisma.tradeOffer.findMany()
    * ```
    */
  get tradeOffer(): Prisma.TradeOfferDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradeOfferItem`: Exposes CRUD operations for the **TradeOfferItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradeOfferItems
    * const tradeOfferItems = await prisma.tradeOfferItem.findMany()
    * ```
    */
  get tradeOfferItem(): Prisma.TradeOfferItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.appOrder`: Exposes CRUD operations for the **AppOrder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AppOrders
    * const appOrders = await prisma.appOrder.findMany()
    * ```
    */
  get appOrder(): Prisma.AppOrderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderRevision`: Exposes CRUD operations for the **OrderRevision** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderRevisions
    * const orderRevisions = await prisma.orderRevision.findMany()
    * ```
    */
  get orderRevision(): Prisma.OrderRevisionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.orderCommunication`: Exposes CRUD operations for the **OrderCommunication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OrderCommunications
    * const orderCommunications = await prisma.orderCommunication.findMany()
    * ```
    */
  get orderCommunication(): Prisma.OrderCommunicationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends bigint
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Card: 'Card',
    Transaction: 'Transaction',
    TradeOffer: 'TradeOffer',
    TradeOfferItem: 'TradeOfferItem',
    AppOrder: 'AppOrder',
    OrderRevision: 'OrderRevision',
    OrderCommunication: 'OrderCommunication'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "card" | "transaction" | "tradeOffer" | "tradeOfferItem" | "appOrder" | "orderRevision" | "orderCommunication"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Card: {
        payload: Prisma.$CardPayload<ExtArgs>
        fields: Prisma.CardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>
          }
          findFirst: {
            args: Prisma.CardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>
          }
          findMany: {
            args: Prisma.CardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>[]
          }
          create: {
            args: Prisma.CardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>
          }
          createMany: {
            args: Prisma.CardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>[]
          }
          delete: {
            args: Prisma.CardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>
          }
          update: {
            args: Prisma.CardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>
          }
          deleteMany: {
            args: Prisma.CardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>[]
          }
          upsert: {
            args: Prisma.CardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardPayload>
          }
          aggregate: {
            args: Prisma.CardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCard>
          }
          groupBy: {
            args: Prisma.CardGroupByArgs<ExtArgs>
            result: $Utils.Optional<CardGroupByOutputType>[]
          }
          count: {
            args: Prisma.CardCountArgs<ExtArgs>
            result: $Utils.Optional<CardCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      TradeOffer: {
        payload: Prisma.$TradeOfferPayload<ExtArgs>
        fields: Prisma.TradeOfferFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeOfferFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeOfferFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>
          }
          findFirst: {
            args: Prisma.TradeOfferFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeOfferFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>
          }
          findMany: {
            args: Prisma.TradeOfferFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>[]
          }
          create: {
            args: Prisma.TradeOfferCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>
          }
          createMany: {
            args: Prisma.TradeOfferCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeOfferCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>[]
          }
          delete: {
            args: Prisma.TradeOfferDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>
          }
          update: {
            args: Prisma.TradeOfferUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>
          }
          deleteMany: {
            args: Prisma.TradeOfferDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeOfferUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeOfferUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>[]
          }
          upsert: {
            args: Prisma.TradeOfferUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferPayload>
          }
          aggregate: {
            args: Prisma.TradeOfferAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradeOffer>
          }
          groupBy: {
            args: Prisma.TradeOfferGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeOfferGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeOfferCountArgs<ExtArgs>
            result: $Utils.Optional<TradeOfferCountAggregateOutputType> | number
          }
        }
      }
      TradeOfferItem: {
        payload: Prisma.$TradeOfferItemPayload<ExtArgs>
        fields: Prisma.TradeOfferItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeOfferItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeOfferItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>
          }
          findFirst: {
            args: Prisma.TradeOfferItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeOfferItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>
          }
          findMany: {
            args: Prisma.TradeOfferItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>[]
          }
          create: {
            args: Prisma.TradeOfferItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>
          }
          createMany: {
            args: Prisma.TradeOfferItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeOfferItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>[]
          }
          delete: {
            args: Prisma.TradeOfferItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>
          }
          update: {
            args: Prisma.TradeOfferItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>
          }
          deleteMany: {
            args: Prisma.TradeOfferItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeOfferItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeOfferItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>[]
          }
          upsert: {
            args: Prisma.TradeOfferItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeOfferItemPayload>
          }
          aggregate: {
            args: Prisma.TradeOfferItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradeOfferItem>
          }
          groupBy: {
            args: Prisma.TradeOfferItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeOfferItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeOfferItemCountArgs<ExtArgs>
            result: $Utils.Optional<TradeOfferItemCountAggregateOutputType> | number
          }
        }
      }
      AppOrder: {
        payload: Prisma.$AppOrderPayload<ExtArgs>
        fields: Prisma.AppOrderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AppOrderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AppOrderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>
          }
          findFirst: {
            args: Prisma.AppOrderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AppOrderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>
          }
          findMany: {
            args: Prisma.AppOrderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>[]
          }
          create: {
            args: Prisma.AppOrderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>
          }
          createMany: {
            args: Prisma.AppOrderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AppOrderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>[]
          }
          delete: {
            args: Prisma.AppOrderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>
          }
          update: {
            args: Prisma.AppOrderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>
          }
          deleteMany: {
            args: Prisma.AppOrderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AppOrderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AppOrderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>[]
          }
          upsert: {
            args: Prisma.AppOrderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AppOrderPayload>
          }
          aggregate: {
            args: Prisma.AppOrderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAppOrder>
          }
          groupBy: {
            args: Prisma.AppOrderGroupByArgs<ExtArgs>
            result: $Utils.Optional<AppOrderGroupByOutputType>[]
          }
          count: {
            args: Prisma.AppOrderCountArgs<ExtArgs>
            result: $Utils.Optional<AppOrderCountAggregateOutputType> | number
          }
        }
      }
      OrderRevision: {
        payload: Prisma.$OrderRevisionPayload<ExtArgs>
        fields: Prisma.OrderRevisionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderRevisionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderRevisionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>
          }
          findFirst: {
            args: Prisma.OrderRevisionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderRevisionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>
          }
          findMany: {
            args: Prisma.OrderRevisionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>[]
          }
          create: {
            args: Prisma.OrderRevisionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>
          }
          createMany: {
            args: Prisma.OrderRevisionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderRevisionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>[]
          }
          delete: {
            args: Prisma.OrderRevisionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>
          }
          update: {
            args: Prisma.OrderRevisionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>
          }
          deleteMany: {
            args: Prisma.OrderRevisionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderRevisionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderRevisionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>[]
          }
          upsert: {
            args: Prisma.OrderRevisionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderRevisionPayload>
          }
          aggregate: {
            args: Prisma.OrderRevisionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderRevision>
          }
          groupBy: {
            args: Prisma.OrderRevisionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderRevisionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderRevisionCountArgs<ExtArgs>
            result: $Utils.Optional<OrderRevisionCountAggregateOutputType> | number
          }
        }
      }
      OrderCommunication: {
        payload: Prisma.$OrderCommunicationPayload<ExtArgs>
        fields: Prisma.OrderCommunicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrderCommunicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrderCommunicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>
          }
          findFirst: {
            args: Prisma.OrderCommunicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrderCommunicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>
          }
          findMany: {
            args: Prisma.OrderCommunicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>[]
          }
          create: {
            args: Prisma.OrderCommunicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>
          }
          createMany: {
            args: Prisma.OrderCommunicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrderCommunicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>[]
          }
          delete: {
            args: Prisma.OrderCommunicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>
          }
          update: {
            args: Prisma.OrderCommunicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>
          }
          deleteMany: {
            args: Prisma.OrderCommunicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrderCommunicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrderCommunicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>[]
          }
          upsert: {
            args: Prisma.OrderCommunicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrderCommunicationPayload>
          }
          aggregate: {
            args: Prisma.OrderCommunicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrderCommunication>
          }
          groupBy: {
            args: Prisma.OrderCommunicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrderCommunicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrderCommunicationCountArgs<ExtArgs>
            result: $Utils.Optional<OrderCommunicationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    card?: CardOmit
    transaction?: TransactionOmit
    tradeOffer?: TradeOfferOmit
    tradeOfferItem?: TradeOfferItemOmit
    appOrder?: AppOrderOmit
    orderRevision?: OrderRevisionOmit
    orderCommunication?: OrderCommunicationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    cards: number
    transactionsFrom: number
    transactionsTo: number
    tradeOffersSent: number
    tradeOffersReceived: number
    appOrders: number
    orderRevisions: number
    orderCommunications: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cards?: boolean | UserCountOutputTypeCountCardsArgs
    transactionsFrom?: boolean | UserCountOutputTypeCountTransactionsFromArgs
    transactionsTo?: boolean | UserCountOutputTypeCountTransactionsToArgs
    tradeOffersSent?: boolean | UserCountOutputTypeCountTradeOffersSentArgs
    tradeOffersReceived?: boolean | UserCountOutputTypeCountTradeOffersReceivedArgs
    appOrders?: boolean | UserCountOutputTypeCountAppOrdersArgs
    orderRevisions?: boolean | UserCountOutputTypeCountOrderRevisionsArgs
    orderCommunications?: boolean | UserCountOutputTypeCountOrderCommunicationsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CardWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTradeOffersSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeOfferWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTradeOffersReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeOfferWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAppOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppOrderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrderRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderRevisionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOrderCommunicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderCommunicationWhereInput
  }


  /**
   * Count Type CardCountOutputType
   */

  export type CardCountOutputType = {
    transactions: number
    tradeOfferItems: number
  }

  export type CardCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | CardCountOutputTypeCountTransactionsArgs
    tradeOfferItems?: boolean | CardCountOutputTypeCountTradeOfferItemsArgs
  }

  // Custom InputTypes
  /**
   * CardCountOutputType without action
   */
  export type CardCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardCountOutputType
     */
    select?: CardCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CardCountOutputType without action
   */
  export type CardCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * CardCountOutputType without action
   */
  export type CardCountOutputTypeCountTradeOfferItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeOfferItemWhereInput
  }


  /**
   * Count Type TradeOfferCountOutputType
   */

  export type TradeOfferCountOutputType = {
    items: number
  }

  export type TradeOfferCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | TradeOfferCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * TradeOfferCountOutputType without action
   */
  export type TradeOfferCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferCountOutputType
     */
    select?: TradeOfferCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradeOfferCountOutputType without action
   */
  export type TradeOfferCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeOfferItemWhereInput
  }


  /**
   * Count Type AppOrderCountOutputType
   */

  export type AppOrderCountOutputType = {
    revisions: number
    communications: number
  }

  export type AppOrderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    revisions?: boolean | AppOrderCountOutputTypeCountRevisionsArgs
    communications?: boolean | AppOrderCountOutputTypeCountCommunicationsArgs
  }

  // Custom InputTypes
  /**
   * AppOrderCountOutputType without action
   */
  export type AppOrderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrderCountOutputType
     */
    select?: AppOrderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AppOrderCountOutputType without action
   */
  export type AppOrderCountOutputTypeCountRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderRevisionWhereInput
  }

  /**
   * AppOrderCountOutputType without action
   */
  export type AppOrderCountOutputTypeCountCommunicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderCommunicationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    eceBalance: number | null
  }

  export type UserSumAggregateOutputType = {
    eceBalance: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    eceBalance: number | null
    refreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    eceBalance: number | null
    refreshToken: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    passwordHash: number
    eceBalance: number
    refreshToken: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    eceBalance?: true
  }

  export type UserSumAggregateInputType = {
    eceBalance?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    eceBalance?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    eceBalance?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    eceBalance?: true
    refreshToken?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    passwordHash: string | null
    eceBalance: number
    refreshToken: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    eceBalance?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    cards?: boolean | User$cardsArgs<ExtArgs>
    transactionsFrom?: boolean | User$transactionsFromArgs<ExtArgs>
    transactionsTo?: boolean | User$transactionsToArgs<ExtArgs>
    tradeOffersSent?: boolean | User$tradeOffersSentArgs<ExtArgs>
    tradeOffersReceived?: boolean | User$tradeOffersReceivedArgs<ExtArgs>
    appOrders?: boolean | User$appOrdersArgs<ExtArgs>
    orderRevisions?: boolean | User$orderRevisionsArgs<ExtArgs>
    orderCommunications?: boolean | User$orderCommunicationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    eceBalance?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    eceBalance?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    eceBalance?: boolean
    refreshToken?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "eceBalance" | "refreshToken" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    cards?: boolean | User$cardsArgs<ExtArgs>
    transactionsFrom?: boolean | User$transactionsFromArgs<ExtArgs>
    transactionsTo?: boolean | User$transactionsToArgs<ExtArgs>
    tradeOffersSent?: boolean | User$tradeOffersSentArgs<ExtArgs>
    tradeOffersReceived?: boolean | User$tradeOffersReceivedArgs<ExtArgs>
    appOrders?: boolean | User$appOrdersArgs<ExtArgs>
    orderRevisions?: boolean | User$orderRevisionsArgs<ExtArgs>
    orderCommunications?: boolean | User$orderCommunicationsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      cards: Prisma.$CardPayload<ExtArgs>[]
      transactionsFrom: Prisma.$TransactionPayload<ExtArgs>[]
      transactionsTo: Prisma.$TransactionPayload<ExtArgs>[]
      tradeOffersSent: Prisma.$TradeOfferPayload<ExtArgs>[]
      tradeOffersReceived: Prisma.$TradeOfferPayload<ExtArgs>[]
      appOrders: Prisma.$AppOrderPayload<ExtArgs>[]
      orderRevisions: Prisma.$OrderRevisionPayload<ExtArgs>[]
      orderCommunications: Prisma.$OrderCommunicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      passwordHash: string | null
      eceBalance: number
      refreshToken: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    cards<T extends User$cardsArgs<ExtArgs> = {}>(args?: Subset<T, User$cardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsFrom<T extends User$transactionsFromArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsFromArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactionsTo<T extends User$transactionsToArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsToArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tradeOffersSent<T extends User$tradeOffersSentArgs<ExtArgs> = {}>(args?: Subset<T, User$tradeOffersSentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tradeOffersReceived<T extends User$tradeOffersReceivedArgs<ExtArgs> = {}>(args?: Subset<T, User$tradeOffersReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    appOrders<T extends User$appOrdersArgs<ExtArgs> = {}>(args?: Subset<T, User$appOrdersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orderRevisions<T extends User$orderRevisionsArgs<ExtArgs> = {}>(args?: Subset<T, User$orderRevisionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    orderCommunications<T extends User$orderCommunicationsArgs<ExtArgs> = {}>(args?: Subset<T, User$orderCommunicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly eceBalance: FieldRef<"User", 'Float'>
    readonly refreshToken: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.cards
   */
  export type User$cardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    where?: CardWhereInput
    orderBy?: CardOrderByWithRelationInput | CardOrderByWithRelationInput[]
    cursor?: CardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CardScalarFieldEnum | CardScalarFieldEnum[]
  }

  /**
   * User.transactionsFrom
   */
  export type User$transactionsFromArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.transactionsTo
   */
  export type User$transactionsToArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User.tradeOffersSent
   */
  export type User$tradeOffersSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    where?: TradeOfferWhereInput
    orderBy?: TradeOfferOrderByWithRelationInput | TradeOfferOrderByWithRelationInput[]
    cursor?: TradeOfferWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeOfferScalarFieldEnum | TradeOfferScalarFieldEnum[]
  }

  /**
   * User.tradeOffersReceived
   */
  export type User$tradeOffersReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    where?: TradeOfferWhereInput
    orderBy?: TradeOfferOrderByWithRelationInput | TradeOfferOrderByWithRelationInput[]
    cursor?: TradeOfferWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeOfferScalarFieldEnum | TradeOfferScalarFieldEnum[]
  }

  /**
   * User.appOrders
   */
  export type User$appOrdersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    where?: AppOrderWhereInput
    orderBy?: AppOrderOrderByWithRelationInput | AppOrderOrderByWithRelationInput[]
    cursor?: AppOrderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AppOrderScalarFieldEnum | AppOrderScalarFieldEnum[]
  }

  /**
   * User.orderRevisions
   */
  export type User$orderRevisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    where?: OrderRevisionWhereInput
    orderBy?: OrderRevisionOrderByWithRelationInput | OrderRevisionOrderByWithRelationInput[]
    cursor?: OrderRevisionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderRevisionScalarFieldEnum | OrderRevisionScalarFieldEnum[]
  }

  /**
   * User.orderCommunications
   */
  export type User$orderCommunicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    where?: OrderCommunicationWhereInput
    orderBy?: OrderCommunicationOrderByWithRelationInput | OrderCommunicationOrderByWithRelationInput[]
    cursor?: OrderCommunicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderCommunicationScalarFieldEnum | OrderCommunicationScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Card
   */

  export type AggregateCard = {
    _count: CardCountAggregateOutputType | null
    _avg: CardAvgAggregateOutputType | null
    _sum: CardSumAggregateOutputType | null
    _min: CardMinAggregateOutputType | null
    _max: CardMaxAggregateOutputType | null
  }

  export type CardAvgAggregateOutputType = {
    valuation: number | null
    marketCap: number | null
    volume24h: number | null
    priceChange24h: number | null
  }

  export type CardSumAggregateOutputType = {
    valuation: number | null
    marketCap: number | null
    volume24h: number | null
    priceChange24h: number | null
  }

  export type CardMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    imageUrl: string | null
    rarity: string | null
    category: string | null
    company: string | null
    valuation: number | null
    marketCap: number | null
    volume24h: number | null
    priceChange24h: number | null
    ownerId: string | null
    isListed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CardMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    imageUrl: string | null
    rarity: string | null
    category: string | null
    company: string | null
    valuation: number | null
    marketCap: number | null
    volume24h: number | null
    priceChange24h: number | null
    ownerId: string | null
    isListed: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CardCountAggregateOutputType = {
    id: number
    name: number
    description: number
    imageUrl: number
    rarity: number
    category: number
    company: number
    valuation: number
    marketCap: number
    volume24h: number
    priceChange24h: number
    attributes: number
    metadata: number
    ownerId: number
    isListed: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CardAvgAggregateInputType = {
    valuation?: true
    marketCap?: true
    volume24h?: true
    priceChange24h?: true
  }

  export type CardSumAggregateInputType = {
    valuation?: true
    marketCap?: true
    volume24h?: true
    priceChange24h?: true
  }

  export type CardMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    rarity?: true
    category?: true
    company?: true
    valuation?: true
    marketCap?: true
    volume24h?: true
    priceChange24h?: true
    ownerId?: true
    isListed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CardMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    rarity?: true
    category?: true
    company?: true
    valuation?: true
    marketCap?: true
    volume24h?: true
    priceChange24h?: true
    ownerId?: true
    isListed?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CardCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    imageUrl?: true
    rarity?: true
    category?: true
    company?: true
    valuation?: true
    marketCap?: true
    volume24h?: true
    priceChange24h?: true
    attributes?: true
    metadata?: true
    ownerId?: true
    isListed?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Card to aggregate.
     */
    where?: CardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cards to fetch.
     */
    orderBy?: CardOrderByWithRelationInput | CardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cards
    **/
    _count?: true | CardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CardMaxAggregateInputType
  }

  export type GetCardAggregateType<T extends CardAggregateArgs> = {
        [P in keyof T & keyof AggregateCard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCard[P]>
      : GetScalarType<T[P], AggregateCard[P]>
  }




  export type CardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CardWhereInput
    orderBy?: CardOrderByWithAggregationInput | CardOrderByWithAggregationInput[]
    by: CardScalarFieldEnum[] | CardScalarFieldEnum
    having?: CardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CardCountAggregateInputType | true
    _avg?: CardAvgAggregateInputType
    _sum?: CardSumAggregateInputType
    _min?: CardMinAggregateInputType
    _max?: CardMaxAggregateInputType
  }

  export type CardGroupByOutputType = {
    id: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap: number | null
    volume24h: number
    priceChange24h: number
    attributes: JsonValue
    metadata: JsonValue
    ownerId: string | null
    isListed: boolean
    createdAt: Date
    updatedAt: Date
    _count: CardCountAggregateOutputType | null
    _avg: CardAvgAggregateOutputType | null
    _sum: CardSumAggregateOutputType | null
    _min: CardMinAggregateOutputType | null
    _max: CardMaxAggregateOutputType | null
  }

  type GetCardGroupByPayload<T extends CardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CardGroupByOutputType[P]>
            : GetScalarType<T[P], CardGroupByOutputType[P]>
        }
      >
    >


  export type CardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    rarity?: boolean
    category?: boolean
    company?: boolean
    valuation?: boolean
    marketCap?: boolean
    volume24h?: boolean
    priceChange24h?: boolean
    attributes?: boolean
    metadata?: boolean
    ownerId?: boolean
    isListed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Card$ownerArgs<ExtArgs>
    transactions?: boolean | Card$transactionsArgs<ExtArgs>
    tradeOfferItems?: boolean | Card$tradeOfferItemsArgs<ExtArgs>
    _count?: boolean | CardCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["card"]>

  export type CardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    rarity?: boolean
    category?: boolean
    company?: boolean
    valuation?: boolean
    marketCap?: boolean
    volume24h?: boolean
    priceChange24h?: boolean
    attributes?: boolean
    metadata?: boolean
    ownerId?: boolean
    isListed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Card$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["card"]>

  export type CardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    rarity?: boolean
    category?: boolean
    company?: boolean
    valuation?: boolean
    marketCap?: boolean
    volume24h?: boolean
    priceChange24h?: boolean
    attributes?: boolean
    metadata?: boolean
    ownerId?: boolean
    isListed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | Card$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["card"]>

  export type CardSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    imageUrl?: boolean
    rarity?: boolean
    category?: boolean
    company?: boolean
    valuation?: boolean
    marketCap?: boolean
    volume24h?: boolean
    priceChange24h?: boolean
    attributes?: boolean
    metadata?: boolean
    ownerId?: boolean
    isListed?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "imageUrl" | "rarity" | "category" | "company" | "valuation" | "marketCap" | "volume24h" | "priceChange24h" | "attributes" | "metadata" | "ownerId" | "isListed" | "createdAt" | "updatedAt", ExtArgs["result"]["card"]>
  export type CardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Card$ownerArgs<ExtArgs>
    transactions?: boolean | Card$transactionsArgs<ExtArgs>
    tradeOfferItems?: boolean | Card$tradeOfferItemsArgs<ExtArgs>
    _count?: boolean | CardCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Card$ownerArgs<ExtArgs>
  }
  export type CardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | Card$ownerArgs<ExtArgs>
  }

  export type $CardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Card"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs> | null
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      tradeOfferItems: Prisma.$TradeOfferItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      imageUrl: string
      rarity: string
      category: string
      company: string
      valuation: number
      marketCap: number | null
      volume24h: number
      priceChange24h: number
      attributes: Prisma.JsonValue
      metadata: Prisma.JsonValue
      ownerId: string | null
      isListed: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["card"]>
    composites: {}
  }

  type CardGetPayload<S extends boolean | null | undefined | CardDefaultArgs> = $Result.GetResult<Prisma.$CardPayload, S>

  type CardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CardCountAggregateInputType | true
    }

  export interface CardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Card'], meta: { name: 'Card' } }
    /**
     * Find zero or one Card that matches the filter.
     * @param {CardFindUniqueArgs} args - Arguments to find a Card
     * @example
     * // Get one Card
     * const card = await prisma.card.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CardFindUniqueArgs>(args: SelectSubset<T, CardFindUniqueArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Card that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CardFindUniqueOrThrowArgs} args - Arguments to find a Card
     * @example
     * // Get one Card
     * const card = await prisma.card.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CardFindUniqueOrThrowArgs>(args: SelectSubset<T, CardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Card that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardFindFirstArgs} args - Arguments to find a Card
     * @example
     * // Get one Card
     * const card = await prisma.card.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CardFindFirstArgs>(args?: SelectSubset<T, CardFindFirstArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Card that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardFindFirstOrThrowArgs} args - Arguments to find a Card
     * @example
     * // Get one Card
     * const card = await prisma.card.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CardFindFirstOrThrowArgs>(args?: SelectSubset<T, CardFindFirstOrThrowArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cards
     * const cards = await prisma.card.findMany()
     * 
     * // Get first 10 Cards
     * const cards = await prisma.card.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cardWithIdOnly = await prisma.card.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CardFindManyArgs>(args?: SelectSubset<T, CardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Card.
     * @param {CardCreateArgs} args - Arguments to create a Card.
     * @example
     * // Create one Card
     * const Card = await prisma.card.create({
     *   data: {
     *     // ... data to create a Card
     *   }
     * })
     * 
     */
    create<T extends CardCreateArgs>(args: SelectSubset<T, CardCreateArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cards.
     * @param {CardCreateManyArgs} args - Arguments to create many Cards.
     * @example
     * // Create many Cards
     * const card = await prisma.card.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CardCreateManyArgs>(args?: SelectSubset<T, CardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cards and returns the data saved in the database.
     * @param {CardCreateManyAndReturnArgs} args - Arguments to create many Cards.
     * @example
     * // Create many Cards
     * const card = await prisma.card.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cards and only return the `id`
     * const cardWithIdOnly = await prisma.card.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CardCreateManyAndReturnArgs>(args?: SelectSubset<T, CardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Card.
     * @param {CardDeleteArgs} args - Arguments to delete one Card.
     * @example
     * // Delete one Card
     * const Card = await prisma.card.delete({
     *   where: {
     *     // ... filter to delete one Card
     *   }
     * })
     * 
     */
    delete<T extends CardDeleteArgs>(args: SelectSubset<T, CardDeleteArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Card.
     * @param {CardUpdateArgs} args - Arguments to update one Card.
     * @example
     * // Update one Card
     * const card = await prisma.card.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CardUpdateArgs>(args: SelectSubset<T, CardUpdateArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cards.
     * @param {CardDeleteManyArgs} args - Arguments to filter Cards to delete.
     * @example
     * // Delete a few Cards
     * const { count } = await prisma.card.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CardDeleteManyArgs>(args?: SelectSubset<T, CardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cards
     * const card = await prisma.card.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CardUpdateManyArgs>(args: SelectSubset<T, CardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cards and returns the data updated in the database.
     * @param {CardUpdateManyAndReturnArgs} args - Arguments to update many Cards.
     * @example
     * // Update many Cards
     * const card = await prisma.card.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cards and only return the `id`
     * const cardWithIdOnly = await prisma.card.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CardUpdateManyAndReturnArgs>(args: SelectSubset<T, CardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Card.
     * @param {CardUpsertArgs} args - Arguments to update or create a Card.
     * @example
     * // Update or create a Card
     * const card = await prisma.card.upsert({
     *   create: {
     *     // ... data to create a Card
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Card we want to update
     *   }
     * })
     */
    upsert<T extends CardUpsertArgs>(args: SelectSubset<T, CardUpsertArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardCountArgs} args - Arguments to filter Cards to count.
     * @example
     * // Count the number of Cards
     * const count = await prisma.card.count({
     *   where: {
     *     // ... the filter for the Cards we want to count
     *   }
     * })
    **/
    count<T extends CardCountArgs>(
      args?: Subset<T, CardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Card.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CardAggregateArgs>(args: Subset<T, CardAggregateArgs>): Prisma.PrismaPromise<GetCardAggregateType<T>>

    /**
     * Group by Card.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CardGroupByArgs['orderBy'] }
        : { orderBy?: CardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Card model
   */
  readonly fields: CardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Card.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends Card$ownerArgs<ExtArgs> = {}>(args?: Subset<T, Card$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    transactions<T extends Card$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, Card$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tradeOfferItems<T extends Card$tradeOfferItemsArgs<ExtArgs> = {}>(args?: Subset<T, Card$tradeOfferItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Card model
   */
  interface CardFieldRefs {
    readonly id: FieldRef<"Card", 'String'>
    readonly name: FieldRef<"Card", 'String'>
    readonly description: FieldRef<"Card", 'String'>
    readonly imageUrl: FieldRef<"Card", 'String'>
    readonly rarity: FieldRef<"Card", 'String'>
    readonly category: FieldRef<"Card", 'String'>
    readonly company: FieldRef<"Card", 'String'>
    readonly valuation: FieldRef<"Card", 'Float'>
    readonly marketCap: FieldRef<"Card", 'Float'>
    readonly volume24h: FieldRef<"Card", 'Float'>
    readonly priceChange24h: FieldRef<"Card", 'Float'>
    readonly attributes: FieldRef<"Card", 'Json'>
    readonly metadata: FieldRef<"Card", 'Json'>
    readonly ownerId: FieldRef<"Card", 'String'>
    readonly isListed: FieldRef<"Card", 'Boolean'>
    readonly createdAt: FieldRef<"Card", 'DateTime'>
    readonly updatedAt: FieldRef<"Card", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Card findUnique
   */
  export type CardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * Filter, which Card to fetch.
     */
    where: CardWhereUniqueInput
  }

  /**
   * Card findUniqueOrThrow
   */
  export type CardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * Filter, which Card to fetch.
     */
    where: CardWhereUniqueInput
  }

  /**
   * Card findFirst
   */
  export type CardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * Filter, which Card to fetch.
     */
    where?: CardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cards to fetch.
     */
    orderBy?: CardOrderByWithRelationInput | CardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cards.
     */
    cursor?: CardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cards.
     */
    distinct?: CardScalarFieldEnum | CardScalarFieldEnum[]
  }

  /**
   * Card findFirstOrThrow
   */
  export type CardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * Filter, which Card to fetch.
     */
    where?: CardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cards to fetch.
     */
    orderBy?: CardOrderByWithRelationInput | CardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cards.
     */
    cursor?: CardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cards.
     */
    distinct?: CardScalarFieldEnum | CardScalarFieldEnum[]
  }

  /**
   * Card findMany
   */
  export type CardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * Filter, which Cards to fetch.
     */
    where?: CardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cards to fetch.
     */
    orderBy?: CardOrderByWithRelationInput | CardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cards.
     */
    cursor?: CardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cards.
     */
    skip?: number
    distinct?: CardScalarFieldEnum | CardScalarFieldEnum[]
  }

  /**
   * Card create
   */
  export type CardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * The data needed to create a Card.
     */
    data: XOR<CardCreateInput, CardUncheckedCreateInput>
  }

  /**
   * Card createMany
   */
  export type CardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cards.
     */
    data: CardCreateManyInput | CardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Card createManyAndReturn
   */
  export type CardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * The data used to create many Cards.
     */
    data: CardCreateManyInput | CardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Card update
   */
  export type CardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * The data needed to update a Card.
     */
    data: XOR<CardUpdateInput, CardUncheckedUpdateInput>
    /**
     * Choose, which Card to update.
     */
    where: CardWhereUniqueInput
  }

  /**
   * Card updateMany
   */
  export type CardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cards.
     */
    data: XOR<CardUpdateManyMutationInput, CardUncheckedUpdateManyInput>
    /**
     * Filter which Cards to update
     */
    where?: CardWhereInput
    /**
     * Limit how many Cards to update.
     */
    limit?: number
  }

  /**
   * Card updateManyAndReturn
   */
  export type CardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * The data used to update Cards.
     */
    data: XOR<CardUpdateManyMutationInput, CardUncheckedUpdateManyInput>
    /**
     * Filter which Cards to update
     */
    where?: CardWhereInput
    /**
     * Limit how many Cards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Card upsert
   */
  export type CardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * The filter to search for the Card to update in case it exists.
     */
    where: CardWhereUniqueInput
    /**
     * In case the Card found by the `where` argument doesn't exist, create a new Card with this data.
     */
    create: XOR<CardCreateInput, CardUncheckedCreateInput>
    /**
     * In case the Card was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CardUpdateInput, CardUncheckedUpdateInput>
  }

  /**
   * Card delete
   */
  export type CardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    /**
     * Filter which Card to delete.
     */
    where: CardWhereUniqueInput
  }

  /**
   * Card deleteMany
   */
  export type CardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cards to delete
     */
    where?: CardWhereInput
    /**
     * Limit how many Cards to delete.
     */
    limit?: number
  }

  /**
   * Card.owner
   */
  export type Card$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Card.transactions
   */
  export type Card$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Card.tradeOfferItems
   */
  export type Card$tradeOfferItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    where?: TradeOfferItemWhereInput
    orderBy?: TradeOfferItemOrderByWithRelationInput | TradeOfferItemOrderByWithRelationInput[]
    cursor?: TradeOfferItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeOfferItemScalarFieldEnum | TradeOfferItemScalarFieldEnum[]
  }

  /**
   * Card without action
   */
  export type CardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    amount: number | null
  }

  export type TransactionSumAggregateOutputType = {
    amount: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    fromUserId: string | null
    toUserId: string | null
    cardId: string | null
    amount: number | null
    currency: string | null
    type: string | null
    status: string | null
    reference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    fromUserId: string | null
    toUserId: string | null
    cardId: string | null
    amount: number | null
    currency: string | null
    type: string | null
    status: string | null
    reference: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    fromUserId: number
    toUserId: number
    cardId: number
    amount: number
    currency: number
    type: number
    status: number
    reference: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    amount?: true
  }

  export type TransactionSumAggregateInputType = {
    amount?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    fromUserId?: true
    toUserId?: true
    cardId?: true
    amount?: true
    currency?: true
    type?: true
    status?: true
    reference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    fromUserId?: true
    toUserId?: true
    cardId?: true
    amount?: true
    currency?: true
    type?: true
    status?: true
    reference?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    fromUserId?: true
    toUserId?: true
    cardId?: true
    amount?: true
    currency?: true
    type?: true
    status?: true
    reference?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    fromUserId: string | null
    toUserId: string | null
    cardId: string | null
    amount: number
    currency: string
    type: string
    status: string
    reference: string | null
    metadata: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    cardId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    status?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fromUser?: boolean | Transaction$fromUserArgs<ExtArgs>
    toUser?: boolean | Transaction$toUserArgs<ExtArgs>
    card?: boolean | Transaction$cardArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    cardId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    status?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fromUser?: boolean | Transaction$fromUserArgs<ExtArgs>
    toUser?: boolean | Transaction$toUserArgs<ExtArgs>
    card?: boolean | Transaction$cardArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    cardId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    status?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    fromUser?: boolean | Transaction$fromUserArgs<ExtArgs>
    toUser?: boolean | Transaction$toUserArgs<ExtArgs>
    card?: boolean | Transaction$cardArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    fromUserId?: boolean
    toUserId?: boolean
    cardId?: boolean
    amount?: boolean
    currency?: boolean
    type?: boolean
    status?: boolean
    reference?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fromUserId" | "toUserId" | "cardId" | "amount" | "currency" | "type" | "status" | "reference" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromUser?: boolean | Transaction$fromUserArgs<ExtArgs>
    toUser?: boolean | Transaction$toUserArgs<ExtArgs>
    card?: boolean | Transaction$cardArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromUser?: boolean | Transaction$fromUserArgs<ExtArgs>
    toUser?: boolean | Transaction$toUserArgs<ExtArgs>
    card?: boolean | Transaction$cardArgs<ExtArgs>
  }
  export type TransactionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    fromUser?: boolean | Transaction$fromUserArgs<ExtArgs>
    toUser?: boolean | Transaction$toUserArgs<ExtArgs>
    card?: boolean | Transaction$cardArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      fromUser: Prisma.$UserPayload<ExtArgs> | null
      toUser: Prisma.$UserPayload<ExtArgs> | null
      card: Prisma.$CardPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fromUserId: string | null
      toUserId: string | null
      cardId: string | null
      amount: number
      currency: string
      type: string
      status: string
      reference: string | null
      metadata: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    fromUser<T extends Transaction$fromUserArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$fromUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    toUser<T extends Transaction$toUserArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$toUserArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    card<T extends Transaction$cardArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$cardArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly fromUserId: FieldRef<"Transaction", 'String'>
    readonly toUserId: FieldRef<"Transaction", 'String'>
    readonly cardId: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Float'>
    readonly currency: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'String'>
    readonly status: FieldRef<"Transaction", 'String'>
    readonly reference: FieldRef<"Transaction", 'String'>
    readonly metadata: FieldRef<"Transaction", 'Json'>
    readonly createdAt: FieldRef<"Transaction", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.fromUser
   */
  export type Transaction$fromUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Transaction.toUser
   */
  export type Transaction$toUserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Transaction.card
   */
  export type Transaction$cardArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Card
     */
    select?: CardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Card
     */
    omit?: CardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CardInclude<ExtArgs> | null
    where?: CardWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model TradeOffer
   */

  export type AggregateTradeOffer = {
    _count: TradeOfferCountAggregateOutputType | null
    _min: TradeOfferMinAggregateOutputType | null
    _max: TradeOfferMaxAggregateOutputType | null
  }

  export type TradeOfferMinAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    status: $Enums.TradeOfferStatus | null
    message: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradeOfferMaxAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    status: $Enums.TradeOfferStatus | null
    message: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TradeOfferCountAggregateOutputType = {
    id: number
    senderId: number
    receiverId: number
    status: number
    message: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TradeOfferMinAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    status?: true
    message?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradeOfferMaxAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    status?: true
    message?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TradeOfferCountAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    status?: true
    message?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TradeOfferAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeOffer to aggregate.
     */
    where?: TradeOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOffers to fetch.
     */
    orderBy?: TradeOfferOrderByWithRelationInput | TradeOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOffers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradeOffers
    **/
    _count?: true | TradeOfferCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeOfferMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeOfferMaxAggregateInputType
  }

  export type GetTradeOfferAggregateType<T extends TradeOfferAggregateArgs> = {
        [P in keyof T & keyof AggregateTradeOffer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradeOffer[P]>
      : GetScalarType<T[P], AggregateTradeOffer[P]>
  }




  export type TradeOfferGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeOfferWhereInput
    orderBy?: TradeOfferOrderByWithAggregationInput | TradeOfferOrderByWithAggregationInput[]
    by: TradeOfferScalarFieldEnum[] | TradeOfferScalarFieldEnum
    having?: TradeOfferScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeOfferCountAggregateInputType | true
    _min?: TradeOfferMinAggregateInputType
    _max?: TradeOfferMaxAggregateInputType
  }

  export type TradeOfferGroupByOutputType = {
    id: string
    senderId: string
    receiverId: string
    status: $Enums.TradeOfferStatus
    message: string | null
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TradeOfferCountAggregateOutputType | null
    _min: TradeOfferMinAggregateOutputType | null
    _max: TradeOfferMaxAggregateOutputType | null
  }

  type GetTradeOfferGroupByPayload<T extends TradeOfferGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeOfferGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeOfferGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeOfferGroupByOutputType[P]>
            : GetScalarType<T[P], TradeOfferGroupByOutputType[P]>
        }
      >
    >


  export type TradeOfferSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    message?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | TradeOffer$itemsArgs<ExtArgs>
    _count?: boolean | TradeOfferCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeOffer"]>

  export type TradeOfferSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    message?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeOffer"]>

  export type TradeOfferSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    message?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeOffer"]>

  export type TradeOfferSelectScalar = {
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    message?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TradeOfferOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "senderId" | "receiverId" | "status" | "message" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["tradeOffer"]>
  export type TradeOfferInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | TradeOffer$itemsArgs<ExtArgs>
    _count?: boolean | TradeOfferCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradeOfferIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TradeOfferIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TradeOfferPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradeOffer"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
      items: Prisma.$TradeOfferItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      senderId: string
      receiverId: string
      status: $Enums.TradeOfferStatus
      message: string | null
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tradeOffer"]>
    composites: {}
  }

  type TradeOfferGetPayload<S extends boolean | null | undefined | TradeOfferDefaultArgs> = $Result.GetResult<Prisma.$TradeOfferPayload, S>

  type TradeOfferCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeOfferFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeOfferCountAggregateInputType | true
    }

  export interface TradeOfferDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradeOffer'], meta: { name: 'TradeOffer' } }
    /**
     * Find zero or one TradeOffer that matches the filter.
     * @param {TradeOfferFindUniqueArgs} args - Arguments to find a TradeOffer
     * @example
     * // Get one TradeOffer
     * const tradeOffer = await prisma.tradeOffer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeOfferFindUniqueArgs>(args: SelectSubset<T, TradeOfferFindUniqueArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradeOffer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeOfferFindUniqueOrThrowArgs} args - Arguments to find a TradeOffer
     * @example
     * // Get one TradeOffer
     * const tradeOffer = await prisma.tradeOffer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeOfferFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeOfferFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeOffer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferFindFirstArgs} args - Arguments to find a TradeOffer
     * @example
     * // Get one TradeOffer
     * const tradeOffer = await prisma.tradeOffer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeOfferFindFirstArgs>(args?: SelectSubset<T, TradeOfferFindFirstArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeOffer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferFindFirstOrThrowArgs} args - Arguments to find a TradeOffer
     * @example
     * // Get one TradeOffer
     * const tradeOffer = await prisma.tradeOffer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeOfferFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeOfferFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradeOffers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradeOffers
     * const tradeOffers = await prisma.tradeOffer.findMany()
     * 
     * // Get first 10 TradeOffers
     * const tradeOffers = await prisma.tradeOffer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeOfferWithIdOnly = await prisma.tradeOffer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeOfferFindManyArgs>(args?: SelectSubset<T, TradeOfferFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradeOffer.
     * @param {TradeOfferCreateArgs} args - Arguments to create a TradeOffer.
     * @example
     * // Create one TradeOffer
     * const TradeOffer = await prisma.tradeOffer.create({
     *   data: {
     *     // ... data to create a TradeOffer
     *   }
     * })
     * 
     */
    create<T extends TradeOfferCreateArgs>(args: SelectSubset<T, TradeOfferCreateArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradeOffers.
     * @param {TradeOfferCreateManyArgs} args - Arguments to create many TradeOffers.
     * @example
     * // Create many TradeOffers
     * const tradeOffer = await prisma.tradeOffer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeOfferCreateManyArgs>(args?: SelectSubset<T, TradeOfferCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradeOffers and returns the data saved in the database.
     * @param {TradeOfferCreateManyAndReturnArgs} args - Arguments to create many TradeOffers.
     * @example
     * // Create many TradeOffers
     * const tradeOffer = await prisma.tradeOffer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradeOffers and only return the `id`
     * const tradeOfferWithIdOnly = await prisma.tradeOffer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeOfferCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeOfferCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradeOffer.
     * @param {TradeOfferDeleteArgs} args - Arguments to delete one TradeOffer.
     * @example
     * // Delete one TradeOffer
     * const TradeOffer = await prisma.tradeOffer.delete({
     *   where: {
     *     // ... filter to delete one TradeOffer
     *   }
     * })
     * 
     */
    delete<T extends TradeOfferDeleteArgs>(args: SelectSubset<T, TradeOfferDeleteArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradeOffer.
     * @param {TradeOfferUpdateArgs} args - Arguments to update one TradeOffer.
     * @example
     * // Update one TradeOffer
     * const tradeOffer = await prisma.tradeOffer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeOfferUpdateArgs>(args: SelectSubset<T, TradeOfferUpdateArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradeOffers.
     * @param {TradeOfferDeleteManyArgs} args - Arguments to filter TradeOffers to delete.
     * @example
     * // Delete a few TradeOffers
     * const { count } = await prisma.tradeOffer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeOfferDeleteManyArgs>(args?: SelectSubset<T, TradeOfferDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeOffers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradeOffers
     * const tradeOffer = await prisma.tradeOffer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeOfferUpdateManyArgs>(args: SelectSubset<T, TradeOfferUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeOffers and returns the data updated in the database.
     * @param {TradeOfferUpdateManyAndReturnArgs} args - Arguments to update many TradeOffers.
     * @example
     * // Update many TradeOffers
     * const tradeOffer = await prisma.tradeOffer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradeOffers and only return the `id`
     * const tradeOfferWithIdOnly = await prisma.tradeOffer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TradeOfferUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeOfferUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradeOffer.
     * @param {TradeOfferUpsertArgs} args - Arguments to update or create a TradeOffer.
     * @example
     * // Update or create a TradeOffer
     * const tradeOffer = await prisma.tradeOffer.upsert({
     *   create: {
     *     // ... data to create a TradeOffer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradeOffer we want to update
     *   }
     * })
     */
    upsert<T extends TradeOfferUpsertArgs>(args: SelectSubset<T, TradeOfferUpsertArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradeOffers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferCountArgs} args - Arguments to filter TradeOffers to count.
     * @example
     * // Count the number of TradeOffers
     * const count = await prisma.tradeOffer.count({
     *   where: {
     *     // ... the filter for the TradeOffers we want to count
     *   }
     * })
    **/
    count<T extends TradeOfferCountArgs>(
      args?: Subset<T, TradeOfferCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeOfferCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradeOffer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradeOfferAggregateArgs>(args: Subset<T, TradeOfferAggregateArgs>): Prisma.PrismaPromise<GetTradeOfferAggregateType<T>>

    /**
     * Group by TradeOffer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradeOfferGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeOfferGroupByArgs['orderBy'] }
        : { orderBy?: TradeOfferGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeOfferGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeOfferGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradeOffer model
   */
  readonly fields: TradeOfferFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradeOffer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeOfferClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends TradeOffer$itemsArgs<ExtArgs> = {}>(args?: Subset<T, TradeOffer$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradeOffer model
   */
  interface TradeOfferFieldRefs {
    readonly id: FieldRef<"TradeOffer", 'String'>
    readonly senderId: FieldRef<"TradeOffer", 'String'>
    readonly receiverId: FieldRef<"TradeOffer", 'String'>
    readonly status: FieldRef<"TradeOffer", 'TradeOfferStatus'>
    readonly message: FieldRef<"TradeOffer", 'String'>
    readonly expiresAt: FieldRef<"TradeOffer", 'DateTime'>
    readonly createdAt: FieldRef<"TradeOffer", 'DateTime'>
    readonly updatedAt: FieldRef<"TradeOffer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradeOffer findUnique
   */
  export type TradeOfferFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * Filter, which TradeOffer to fetch.
     */
    where: TradeOfferWhereUniqueInput
  }

  /**
   * TradeOffer findUniqueOrThrow
   */
  export type TradeOfferFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * Filter, which TradeOffer to fetch.
     */
    where: TradeOfferWhereUniqueInput
  }

  /**
   * TradeOffer findFirst
   */
  export type TradeOfferFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * Filter, which TradeOffer to fetch.
     */
    where?: TradeOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOffers to fetch.
     */
    orderBy?: TradeOfferOrderByWithRelationInput | TradeOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeOffers.
     */
    cursor?: TradeOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOffers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeOffers.
     */
    distinct?: TradeOfferScalarFieldEnum | TradeOfferScalarFieldEnum[]
  }

  /**
   * TradeOffer findFirstOrThrow
   */
  export type TradeOfferFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * Filter, which TradeOffer to fetch.
     */
    where?: TradeOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOffers to fetch.
     */
    orderBy?: TradeOfferOrderByWithRelationInput | TradeOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeOffers.
     */
    cursor?: TradeOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOffers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeOffers.
     */
    distinct?: TradeOfferScalarFieldEnum | TradeOfferScalarFieldEnum[]
  }

  /**
   * TradeOffer findMany
   */
  export type TradeOfferFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * Filter, which TradeOffers to fetch.
     */
    where?: TradeOfferWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOffers to fetch.
     */
    orderBy?: TradeOfferOrderByWithRelationInput | TradeOfferOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradeOffers.
     */
    cursor?: TradeOfferWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOffers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOffers.
     */
    skip?: number
    distinct?: TradeOfferScalarFieldEnum | TradeOfferScalarFieldEnum[]
  }

  /**
   * TradeOffer create
   */
  export type TradeOfferCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * The data needed to create a TradeOffer.
     */
    data: XOR<TradeOfferCreateInput, TradeOfferUncheckedCreateInput>
  }

  /**
   * TradeOffer createMany
   */
  export type TradeOfferCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradeOffers.
     */
    data: TradeOfferCreateManyInput | TradeOfferCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradeOffer createManyAndReturn
   */
  export type TradeOfferCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * The data used to create many TradeOffers.
     */
    data: TradeOfferCreateManyInput | TradeOfferCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeOffer update
   */
  export type TradeOfferUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * The data needed to update a TradeOffer.
     */
    data: XOR<TradeOfferUpdateInput, TradeOfferUncheckedUpdateInput>
    /**
     * Choose, which TradeOffer to update.
     */
    where: TradeOfferWhereUniqueInput
  }

  /**
   * TradeOffer updateMany
   */
  export type TradeOfferUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradeOffers.
     */
    data: XOR<TradeOfferUpdateManyMutationInput, TradeOfferUncheckedUpdateManyInput>
    /**
     * Filter which TradeOffers to update
     */
    where?: TradeOfferWhereInput
    /**
     * Limit how many TradeOffers to update.
     */
    limit?: number
  }

  /**
   * TradeOffer updateManyAndReturn
   */
  export type TradeOfferUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * The data used to update TradeOffers.
     */
    data: XOR<TradeOfferUpdateManyMutationInput, TradeOfferUncheckedUpdateManyInput>
    /**
     * Filter which TradeOffers to update
     */
    where?: TradeOfferWhereInput
    /**
     * Limit how many TradeOffers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeOffer upsert
   */
  export type TradeOfferUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * The filter to search for the TradeOffer to update in case it exists.
     */
    where: TradeOfferWhereUniqueInput
    /**
     * In case the TradeOffer found by the `where` argument doesn't exist, create a new TradeOffer with this data.
     */
    create: XOR<TradeOfferCreateInput, TradeOfferUncheckedCreateInput>
    /**
     * In case the TradeOffer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeOfferUpdateInput, TradeOfferUncheckedUpdateInput>
  }

  /**
   * TradeOffer delete
   */
  export type TradeOfferDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
    /**
     * Filter which TradeOffer to delete.
     */
    where: TradeOfferWhereUniqueInput
  }

  /**
   * TradeOffer deleteMany
   */
  export type TradeOfferDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeOffers to delete
     */
    where?: TradeOfferWhereInput
    /**
     * Limit how many TradeOffers to delete.
     */
    limit?: number
  }

  /**
   * TradeOffer.items
   */
  export type TradeOffer$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    where?: TradeOfferItemWhereInput
    orderBy?: TradeOfferItemOrderByWithRelationInput | TradeOfferItemOrderByWithRelationInput[]
    cursor?: TradeOfferItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeOfferItemScalarFieldEnum | TradeOfferItemScalarFieldEnum[]
  }

  /**
   * TradeOffer without action
   */
  export type TradeOfferDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOffer
     */
    select?: TradeOfferSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOffer
     */
    omit?: TradeOfferOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferInclude<ExtArgs> | null
  }


  /**
   * Model TradeOfferItem
   */

  export type AggregateTradeOfferItem = {
    _count: TradeOfferItemCountAggregateOutputType | null
    _avg: TradeOfferItemAvgAggregateOutputType | null
    _sum: TradeOfferItemSumAggregateOutputType | null
    _min: TradeOfferItemMinAggregateOutputType | null
    _max: TradeOfferItemMaxAggregateOutputType | null
  }

  export type TradeOfferItemAvgAggregateOutputType = {
    quantity: number | null
  }

  export type TradeOfferItemSumAggregateOutputType = {
    quantity: number | null
  }

  export type TradeOfferItemMinAggregateOutputType = {
    id: string | null
    tradeOfferId: string | null
    cardId: string | null
    role: $Enums.TradeOfferItemRole | null
    quantity: number | null
    createdAt: Date | null
  }

  export type TradeOfferItemMaxAggregateOutputType = {
    id: string | null
    tradeOfferId: string | null
    cardId: string | null
    role: $Enums.TradeOfferItemRole | null
    quantity: number | null
    createdAt: Date | null
  }

  export type TradeOfferItemCountAggregateOutputType = {
    id: number
    tradeOfferId: number
    cardId: number
    role: number
    quantity: number
    createdAt: number
    _all: number
  }


  export type TradeOfferItemAvgAggregateInputType = {
    quantity?: true
  }

  export type TradeOfferItemSumAggregateInputType = {
    quantity?: true
  }

  export type TradeOfferItemMinAggregateInputType = {
    id?: true
    tradeOfferId?: true
    cardId?: true
    role?: true
    quantity?: true
    createdAt?: true
  }

  export type TradeOfferItemMaxAggregateInputType = {
    id?: true
    tradeOfferId?: true
    cardId?: true
    role?: true
    quantity?: true
    createdAt?: true
  }

  export type TradeOfferItemCountAggregateInputType = {
    id?: true
    tradeOfferId?: true
    cardId?: true
    role?: true
    quantity?: true
    createdAt?: true
    _all?: true
  }

  export type TradeOfferItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeOfferItem to aggregate.
     */
    where?: TradeOfferItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOfferItems to fetch.
     */
    orderBy?: TradeOfferItemOrderByWithRelationInput | TradeOfferItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeOfferItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOfferItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOfferItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradeOfferItems
    **/
    _count?: true | TradeOfferItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradeOfferItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradeOfferItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeOfferItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeOfferItemMaxAggregateInputType
  }

  export type GetTradeOfferItemAggregateType<T extends TradeOfferItemAggregateArgs> = {
        [P in keyof T & keyof AggregateTradeOfferItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradeOfferItem[P]>
      : GetScalarType<T[P], AggregateTradeOfferItem[P]>
  }




  export type TradeOfferItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeOfferItemWhereInput
    orderBy?: TradeOfferItemOrderByWithAggregationInput | TradeOfferItemOrderByWithAggregationInput[]
    by: TradeOfferItemScalarFieldEnum[] | TradeOfferItemScalarFieldEnum
    having?: TradeOfferItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeOfferItemCountAggregateInputType | true
    _avg?: TradeOfferItemAvgAggregateInputType
    _sum?: TradeOfferItemSumAggregateInputType
    _min?: TradeOfferItemMinAggregateInputType
    _max?: TradeOfferItemMaxAggregateInputType
  }

  export type TradeOfferItemGroupByOutputType = {
    id: string
    tradeOfferId: string
    cardId: string
    role: $Enums.TradeOfferItemRole
    quantity: number
    createdAt: Date
    _count: TradeOfferItemCountAggregateOutputType | null
    _avg: TradeOfferItemAvgAggregateOutputType | null
    _sum: TradeOfferItemSumAggregateOutputType | null
    _min: TradeOfferItemMinAggregateOutputType | null
    _max: TradeOfferItemMaxAggregateOutputType | null
  }

  type GetTradeOfferItemGroupByPayload<T extends TradeOfferItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeOfferItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeOfferItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeOfferItemGroupByOutputType[P]>
            : GetScalarType<T[P], TradeOfferItemGroupByOutputType[P]>
        }
      >
    >


  export type TradeOfferItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tradeOfferId?: boolean
    cardId?: boolean
    role?: boolean
    quantity?: boolean
    createdAt?: boolean
    tradeOffer?: boolean | TradeOfferDefaultArgs<ExtArgs>
    card?: boolean | CardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeOfferItem"]>

  export type TradeOfferItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tradeOfferId?: boolean
    cardId?: boolean
    role?: boolean
    quantity?: boolean
    createdAt?: boolean
    tradeOffer?: boolean | TradeOfferDefaultArgs<ExtArgs>
    card?: boolean | CardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeOfferItem"]>

  export type TradeOfferItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tradeOfferId?: boolean
    cardId?: boolean
    role?: boolean
    quantity?: boolean
    createdAt?: boolean
    tradeOffer?: boolean | TradeOfferDefaultArgs<ExtArgs>
    card?: boolean | CardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeOfferItem"]>

  export type TradeOfferItemSelectScalar = {
    id?: boolean
    tradeOfferId?: boolean
    cardId?: boolean
    role?: boolean
    quantity?: boolean
    createdAt?: boolean
  }

  export type TradeOfferItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tradeOfferId" | "cardId" | "role" | "quantity" | "createdAt", ExtArgs["result"]["tradeOfferItem"]>
  export type TradeOfferItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tradeOffer?: boolean | TradeOfferDefaultArgs<ExtArgs>
    card?: boolean | CardDefaultArgs<ExtArgs>
  }
  export type TradeOfferItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tradeOffer?: boolean | TradeOfferDefaultArgs<ExtArgs>
    card?: boolean | CardDefaultArgs<ExtArgs>
  }
  export type TradeOfferItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tradeOffer?: boolean | TradeOfferDefaultArgs<ExtArgs>
    card?: boolean | CardDefaultArgs<ExtArgs>
  }

  export type $TradeOfferItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradeOfferItem"
    objects: {
      tradeOffer: Prisma.$TradeOfferPayload<ExtArgs>
      card: Prisma.$CardPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tradeOfferId: string
      cardId: string
      role: $Enums.TradeOfferItemRole
      quantity: number
      createdAt: Date
    }, ExtArgs["result"]["tradeOfferItem"]>
    composites: {}
  }

  type TradeOfferItemGetPayload<S extends boolean | null | undefined | TradeOfferItemDefaultArgs> = $Result.GetResult<Prisma.$TradeOfferItemPayload, S>

  type TradeOfferItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeOfferItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeOfferItemCountAggregateInputType | true
    }

  export interface TradeOfferItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradeOfferItem'], meta: { name: 'TradeOfferItem' } }
    /**
     * Find zero or one TradeOfferItem that matches the filter.
     * @param {TradeOfferItemFindUniqueArgs} args - Arguments to find a TradeOfferItem
     * @example
     * // Get one TradeOfferItem
     * const tradeOfferItem = await prisma.tradeOfferItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeOfferItemFindUniqueArgs>(args: SelectSubset<T, TradeOfferItemFindUniqueArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradeOfferItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeOfferItemFindUniqueOrThrowArgs} args - Arguments to find a TradeOfferItem
     * @example
     * // Get one TradeOfferItem
     * const tradeOfferItem = await prisma.tradeOfferItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeOfferItemFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeOfferItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeOfferItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemFindFirstArgs} args - Arguments to find a TradeOfferItem
     * @example
     * // Get one TradeOfferItem
     * const tradeOfferItem = await prisma.tradeOfferItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeOfferItemFindFirstArgs>(args?: SelectSubset<T, TradeOfferItemFindFirstArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeOfferItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemFindFirstOrThrowArgs} args - Arguments to find a TradeOfferItem
     * @example
     * // Get one TradeOfferItem
     * const tradeOfferItem = await prisma.tradeOfferItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeOfferItemFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeOfferItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradeOfferItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradeOfferItems
     * const tradeOfferItems = await prisma.tradeOfferItem.findMany()
     * 
     * // Get first 10 TradeOfferItems
     * const tradeOfferItems = await prisma.tradeOfferItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeOfferItemWithIdOnly = await prisma.tradeOfferItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeOfferItemFindManyArgs>(args?: SelectSubset<T, TradeOfferItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradeOfferItem.
     * @param {TradeOfferItemCreateArgs} args - Arguments to create a TradeOfferItem.
     * @example
     * // Create one TradeOfferItem
     * const TradeOfferItem = await prisma.tradeOfferItem.create({
     *   data: {
     *     // ... data to create a TradeOfferItem
     *   }
     * })
     * 
     */
    create<T extends TradeOfferItemCreateArgs>(args: SelectSubset<T, TradeOfferItemCreateArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradeOfferItems.
     * @param {TradeOfferItemCreateManyArgs} args - Arguments to create many TradeOfferItems.
     * @example
     * // Create many TradeOfferItems
     * const tradeOfferItem = await prisma.tradeOfferItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeOfferItemCreateManyArgs>(args?: SelectSubset<T, TradeOfferItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradeOfferItems and returns the data saved in the database.
     * @param {TradeOfferItemCreateManyAndReturnArgs} args - Arguments to create many TradeOfferItems.
     * @example
     * // Create many TradeOfferItems
     * const tradeOfferItem = await prisma.tradeOfferItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradeOfferItems and only return the `id`
     * const tradeOfferItemWithIdOnly = await prisma.tradeOfferItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeOfferItemCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeOfferItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradeOfferItem.
     * @param {TradeOfferItemDeleteArgs} args - Arguments to delete one TradeOfferItem.
     * @example
     * // Delete one TradeOfferItem
     * const TradeOfferItem = await prisma.tradeOfferItem.delete({
     *   where: {
     *     // ... filter to delete one TradeOfferItem
     *   }
     * })
     * 
     */
    delete<T extends TradeOfferItemDeleteArgs>(args: SelectSubset<T, TradeOfferItemDeleteArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradeOfferItem.
     * @param {TradeOfferItemUpdateArgs} args - Arguments to update one TradeOfferItem.
     * @example
     * // Update one TradeOfferItem
     * const tradeOfferItem = await prisma.tradeOfferItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeOfferItemUpdateArgs>(args: SelectSubset<T, TradeOfferItemUpdateArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradeOfferItems.
     * @param {TradeOfferItemDeleteManyArgs} args - Arguments to filter TradeOfferItems to delete.
     * @example
     * // Delete a few TradeOfferItems
     * const { count } = await prisma.tradeOfferItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeOfferItemDeleteManyArgs>(args?: SelectSubset<T, TradeOfferItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeOfferItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradeOfferItems
     * const tradeOfferItem = await prisma.tradeOfferItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeOfferItemUpdateManyArgs>(args: SelectSubset<T, TradeOfferItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeOfferItems and returns the data updated in the database.
     * @param {TradeOfferItemUpdateManyAndReturnArgs} args - Arguments to update many TradeOfferItems.
     * @example
     * // Update many TradeOfferItems
     * const tradeOfferItem = await prisma.tradeOfferItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradeOfferItems and only return the `id`
     * const tradeOfferItemWithIdOnly = await prisma.tradeOfferItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TradeOfferItemUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeOfferItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradeOfferItem.
     * @param {TradeOfferItemUpsertArgs} args - Arguments to update or create a TradeOfferItem.
     * @example
     * // Update or create a TradeOfferItem
     * const tradeOfferItem = await prisma.tradeOfferItem.upsert({
     *   create: {
     *     // ... data to create a TradeOfferItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradeOfferItem we want to update
     *   }
     * })
     */
    upsert<T extends TradeOfferItemUpsertArgs>(args: SelectSubset<T, TradeOfferItemUpsertArgs<ExtArgs>>): Prisma__TradeOfferItemClient<$Result.GetResult<Prisma.$TradeOfferItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradeOfferItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemCountArgs} args - Arguments to filter TradeOfferItems to count.
     * @example
     * // Count the number of TradeOfferItems
     * const count = await prisma.tradeOfferItem.count({
     *   where: {
     *     // ... the filter for the TradeOfferItems we want to count
     *   }
     * })
    **/
    count<T extends TradeOfferItemCountArgs>(
      args?: Subset<T, TradeOfferItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeOfferItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradeOfferItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradeOfferItemAggregateArgs>(args: Subset<T, TradeOfferItemAggregateArgs>): Prisma.PrismaPromise<GetTradeOfferItemAggregateType<T>>

    /**
     * Group by TradeOfferItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeOfferItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradeOfferItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeOfferItemGroupByArgs['orderBy'] }
        : { orderBy?: TradeOfferItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeOfferItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeOfferItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradeOfferItem model
   */
  readonly fields: TradeOfferItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradeOfferItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeOfferItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tradeOffer<T extends TradeOfferDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TradeOfferDefaultArgs<ExtArgs>>): Prisma__TradeOfferClient<$Result.GetResult<Prisma.$TradeOfferPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    card<T extends CardDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CardDefaultArgs<ExtArgs>>): Prisma__CardClient<$Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradeOfferItem model
   */
  interface TradeOfferItemFieldRefs {
    readonly id: FieldRef<"TradeOfferItem", 'String'>
    readonly tradeOfferId: FieldRef<"TradeOfferItem", 'String'>
    readonly cardId: FieldRef<"TradeOfferItem", 'String'>
    readonly role: FieldRef<"TradeOfferItem", 'TradeOfferItemRole'>
    readonly quantity: FieldRef<"TradeOfferItem", 'Int'>
    readonly createdAt: FieldRef<"TradeOfferItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradeOfferItem findUnique
   */
  export type TradeOfferItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * Filter, which TradeOfferItem to fetch.
     */
    where: TradeOfferItemWhereUniqueInput
  }

  /**
   * TradeOfferItem findUniqueOrThrow
   */
  export type TradeOfferItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * Filter, which TradeOfferItem to fetch.
     */
    where: TradeOfferItemWhereUniqueInput
  }

  /**
   * TradeOfferItem findFirst
   */
  export type TradeOfferItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * Filter, which TradeOfferItem to fetch.
     */
    where?: TradeOfferItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOfferItems to fetch.
     */
    orderBy?: TradeOfferItemOrderByWithRelationInput | TradeOfferItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeOfferItems.
     */
    cursor?: TradeOfferItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOfferItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOfferItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeOfferItems.
     */
    distinct?: TradeOfferItemScalarFieldEnum | TradeOfferItemScalarFieldEnum[]
  }

  /**
   * TradeOfferItem findFirstOrThrow
   */
  export type TradeOfferItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * Filter, which TradeOfferItem to fetch.
     */
    where?: TradeOfferItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOfferItems to fetch.
     */
    orderBy?: TradeOfferItemOrderByWithRelationInput | TradeOfferItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeOfferItems.
     */
    cursor?: TradeOfferItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOfferItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOfferItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeOfferItems.
     */
    distinct?: TradeOfferItemScalarFieldEnum | TradeOfferItemScalarFieldEnum[]
  }

  /**
   * TradeOfferItem findMany
   */
  export type TradeOfferItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * Filter, which TradeOfferItems to fetch.
     */
    where?: TradeOfferItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeOfferItems to fetch.
     */
    orderBy?: TradeOfferItemOrderByWithRelationInput | TradeOfferItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradeOfferItems.
     */
    cursor?: TradeOfferItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeOfferItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeOfferItems.
     */
    skip?: number
    distinct?: TradeOfferItemScalarFieldEnum | TradeOfferItemScalarFieldEnum[]
  }

  /**
   * TradeOfferItem create
   */
  export type TradeOfferItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * The data needed to create a TradeOfferItem.
     */
    data: XOR<TradeOfferItemCreateInput, TradeOfferItemUncheckedCreateInput>
  }

  /**
   * TradeOfferItem createMany
   */
  export type TradeOfferItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradeOfferItems.
     */
    data: TradeOfferItemCreateManyInput | TradeOfferItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradeOfferItem createManyAndReturn
   */
  export type TradeOfferItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * The data used to create many TradeOfferItems.
     */
    data: TradeOfferItemCreateManyInput | TradeOfferItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeOfferItem update
   */
  export type TradeOfferItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * The data needed to update a TradeOfferItem.
     */
    data: XOR<TradeOfferItemUpdateInput, TradeOfferItemUncheckedUpdateInput>
    /**
     * Choose, which TradeOfferItem to update.
     */
    where: TradeOfferItemWhereUniqueInput
  }

  /**
   * TradeOfferItem updateMany
   */
  export type TradeOfferItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradeOfferItems.
     */
    data: XOR<TradeOfferItemUpdateManyMutationInput, TradeOfferItemUncheckedUpdateManyInput>
    /**
     * Filter which TradeOfferItems to update
     */
    where?: TradeOfferItemWhereInput
    /**
     * Limit how many TradeOfferItems to update.
     */
    limit?: number
  }

  /**
   * TradeOfferItem updateManyAndReturn
   */
  export type TradeOfferItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * The data used to update TradeOfferItems.
     */
    data: XOR<TradeOfferItemUpdateManyMutationInput, TradeOfferItemUncheckedUpdateManyInput>
    /**
     * Filter which TradeOfferItems to update
     */
    where?: TradeOfferItemWhereInput
    /**
     * Limit how many TradeOfferItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeOfferItem upsert
   */
  export type TradeOfferItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * The filter to search for the TradeOfferItem to update in case it exists.
     */
    where: TradeOfferItemWhereUniqueInput
    /**
     * In case the TradeOfferItem found by the `where` argument doesn't exist, create a new TradeOfferItem with this data.
     */
    create: XOR<TradeOfferItemCreateInput, TradeOfferItemUncheckedCreateInput>
    /**
     * In case the TradeOfferItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeOfferItemUpdateInput, TradeOfferItemUncheckedUpdateInput>
  }

  /**
   * TradeOfferItem delete
   */
  export type TradeOfferItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
    /**
     * Filter which TradeOfferItem to delete.
     */
    where: TradeOfferItemWhereUniqueInput
  }

  /**
   * TradeOfferItem deleteMany
   */
  export type TradeOfferItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeOfferItems to delete
     */
    where?: TradeOfferItemWhereInput
    /**
     * Limit how many TradeOfferItems to delete.
     */
    limit?: number
  }

  /**
   * TradeOfferItem without action
   */
  export type TradeOfferItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeOfferItem
     */
    select?: TradeOfferItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeOfferItem
     */
    omit?: TradeOfferItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeOfferItemInclude<ExtArgs> | null
  }


  /**
   * Model AppOrder
   */

  export type AggregateAppOrder = {
    _count: AppOrderCountAggregateOutputType | null
    _avg: AppOrderAvgAggregateOutputType | null
    _sum: AppOrderSumAggregateOutputType | null
    _min: AppOrderMinAggregateOutputType | null
    _max: AppOrderMaxAggregateOutputType | null
  }

  export type AppOrderAvgAggregateOutputType = {
    estimatedCost: number | null
    progressPercentage: number | null
  }

  export type AppOrderSumAggregateOutputType = {
    estimatedCost: number | null
    progressPercentage: number | null
  }

  export type AppOrderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    projectType: string | null
    title: string | null
    description: string | null
    timeline: string | null
    estimatedCost: number | null
    currency: string | null
    status: string | null
    priority: string | null
    progressPercentage: number | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppOrderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    projectType: string | null
    title: string | null
    description: string | null
    timeline: string | null
    estimatedCost: number | null
    currency: string | null
    status: string | null
    priority: string | null
    progressPercentage: number | null
    completedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AppOrderCountAggregateOutputType = {
    id: number
    userId: number
    projectType: number
    title: number
    description: number
    requirements: number
    timeline: number
    estimatedCost: number
    currency: number
    status: number
    priority: number
    progressPercentage: number
    completedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AppOrderAvgAggregateInputType = {
    estimatedCost?: true
    progressPercentage?: true
  }

  export type AppOrderSumAggregateInputType = {
    estimatedCost?: true
    progressPercentage?: true
  }

  export type AppOrderMinAggregateInputType = {
    id?: true
    userId?: true
    projectType?: true
    title?: true
    description?: true
    timeline?: true
    estimatedCost?: true
    currency?: true
    status?: true
    priority?: true
    progressPercentage?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppOrderMaxAggregateInputType = {
    id?: true
    userId?: true
    projectType?: true
    title?: true
    description?: true
    timeline?: true
    estimatedCost?: true
    currency?: true
    status?: true
    priority?: true
    progressPercentage?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AppOrderCountAggregateInputType = {
    id?: true
    userId?: true
    projectType?: true
    title?: true
    description?: true
    requirements?: true
    timeline?: true
    estimatedCost?: true
    currency?: true
    status?: true
    priority?: true
    progressPercentage?: true
    completedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AppOrderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppOrder to aggregate.
     */
    where?: AppOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppOrders to fetch.
     */
    orderBy?: AppOrderOrderByWithRelationInput | AppOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AppOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AppOrders
    **/
    _count?: true | AppOrderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AppOrderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AppOrderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AppOrderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AppOrderMaxAggregateInputType
  }

  export type GetAppOrderAggregateType<T extends AppOrderAggregateArgs> = {
        [P in keyof T & keyof AggregateAppOrder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAppOrder[P]>
      : GetScalarType<T[P], AggregateAppOrder[P]>
  }




  export type AppOrderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AppOrderWhereInput
    orderBy?: AppOrderOrderByWithAggregationInput | AppOrderOrderByWithAggregationInput[]
    by: AppOrderScalarFieldEnum[] | AppOrderScalarFieldEnum
    having?: AppOrderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AppOrderCountAggregateInputType | true
    _avg?: AppOrderAvgAggregateInputType
    _sum?: AppOrderSumAggregateInputType
    _min?: AppOrderMinAggregateInputType
    _max?: AppOrderMaxAggregateInputType
  }

  export type AppOrderGroupByOutputType = {
    id: string
    userId: string
    projectType: string
    title: string
    description: string
    requirements: JsonValue
    timeline: string
    estimatedCost: number
    currency: string
    status: string
    priority: string
    progressPercentage: number
    completedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: AppOrderCountAggregateOutputType | null
    _avg: AppOrderAvgAggregateOutputType | null
    _sum: AppOrderSumAggregateOutputType | null
    _min: AppOrderMinAggregateOutputType | null
    _max: AppOrderMaxAggregateOutputType | null
  }

  type GetAppOrderGroupByPayload<T extends AppOrderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AppOrderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AppOrderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AppOrderGroupByOutputType[P]>
            : GetScalarType<T[P], AppOrderGroupByOutputType[P]>
        }
      >
    >


  export type AppOrderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectType?: boolean
    title?: boolean
    description?: boolean
    requirements?: boolean
    timeline?: boolean
    estimatedCost?: boolean
    currency?: boolean
    status?: boolean
    priority?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    revisions?: boolean | AppOrder$revisionsArgs<ExtArgs>
    communications?: boolean | AppOrder$communicationsArgs<ExtArgs>
    _count?: boolean | AppOrderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appOrder"]>

  export type AppOrderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectType?: boolean
    title?: boolean
    description?: boolean
    requirements?: boolean
    timeline?: boolean
    estimatedCost?: boolean
    currency?: boolean
    status?: boolean
    priority?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appOrder"]>

  export type AppOrderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectType?: boolean
    title?: boolean
    description?: boolean
    requirements?: boolean
    timeline?: boolean
    estimatedCost?: boolean
    currency?: boolean
    status?: boolean
    priority?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["appOrder"]>

  export type AppOrderSelectScalar = {
    id?: boolean
    userId?: boolean
    projectType?: boolean
    title?: boolean
    description?: boolean
    requirements?: boolean
    timeline?: boolean
    estimatedCost?: boolean
    currency?: boolean
    status?: boolean
    priority?: boolean
    progressPercentage?: boolean
    completedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AppOrderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "projectType" | "title" | "description" | "requirements" | "timeline" | "estimatedCost" | "currency" | "status" | "priority" | "progressPercentage" | "completedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["appOrder"]>
  export type AppOrderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    revisions?: boolean | AppOrder$revisionsArgs<ExtArgs>
    communications?: boolean | AppOrder$communicationsArgs<ExtArgs>
    _count?: boolean | AppOrderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AppOrderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AppOrderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AppOrderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AppOrder"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      revisions: Prisma.$OrderRevisionPayload<ExtArgs>[]
      communications: Prisma.$OrderCommunicationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      projectType: string
      title: string
      description: string
      requirements: Prisma.JsonValue
      timeline: string
      estimatedCost: number
      currency: string
      status: string
      priority: string
      progressPercentage: number
      completedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["appOrder"]>
    composites: {}
  }

  type AppOrderGetPayload<S extends boolean | null | undefined | AppOrderDefaultArgs> = $Result.GetResult<Prisma.$AppOrderPayload, S>

  type AppOrderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AppOrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AppOrderCountAggregateInputType | true
    }

  export interface AppOrderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AppOrder'], meta: { name: 'AppOrder' } }
    /**
     * Find zero or one AppOrder that matches the filter.
     * @param {AppOrderFindUniqueArgs} args - Arguments to find a AppOrder
     * @example
     * // Get one AppOrder
     * const appOrder = await prisma.appOrder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AppOrderFindUniqueArgs>(args: SelectSubset<T, AppOrderFindUniqueArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AppOrder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AppOrderFindUniqueOrThrowArgs} args - Arguments to find a AppOrder
     * @example
     * // Get one AppOrder
     * const appOrder = await prisma.appOrder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AppOrderFindUniqueOrThrowArgs>(args: SelectSubset<T, AppOrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppOrder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderFindFirstArgs} args - Arguments to find a AppOrder
     * @example
     * // Get one AppOrder
     * const appOrder = await prisma.appOrder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AppOrderFindFirstArgs>(args?: SelectSubset<T, AppOrderFindFirstArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AppOrder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderFindFirstOrThrowArgs} args - Arguments to find a AppOrder
     * @example
     * // Get one AppOrder
     * const appOrder = await prisma.appOrder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AppOrderFindFirstOrThrowArgs>(args?: SelectSubset<T, AppOrderFindFirstOrThrowArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AppOrders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AppOrders
     * const appOrders = await prisma.appOrder.findMany()
     * 
     * // Get first 10 AppOrders
     * const appOrders = await prisma.appOrder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const appOrderWithIdOnly = await prisma.appOrder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AppOrderFindManyArgs>(args?: SelectSubset<T, AppOrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AppOrder.
     * @param {AppOrderCreateArgs} args - Arguments to create a AppOrder.
     * @example
     * // Create one AppOrder
     * const AppOrder = await prisma.appOrder.create({
     *   data: {
     *     // ... data to create a AppOrder
     *   }
     * })
     * 
     */
    create<T extends AppOrderCreateArgs>(args: SelectSubset<T, AppOrderCreateArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AppOrders.
     * @param {AppOrderCreateManyArgs} args - Arguments to create many AppOrders.
     * @example
     * // Create many AppOrders
     * const appOrder = await prisma.appOrder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AppOrderCreateManyArgs>(args?: SelectSubset<T, AppOrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AppOrders and returns the data saved in the database.
     * @param {AppOrderCreateManyAndReturnArgs} args - Arguments to create many AppOrders.
     * @example
     * // Create many AppOrders
     * const appOrder = await prisma.appOrder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AppOrders and only return the `id`
     * const appOrderWithIdOnly = await prisma.appOrder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AppOrderCreateManyAndReturnArgs>(args?: SelectSubset<T, AppOrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AppOrder.
     * @param {AppOrderDeleteArgs} args - Arguments to delete one AppOrder.
     * @example
     * // Delete one AppOrder
     * const AppOrder = await prisma.appOrder.delete({
     *   where: {
     *     // ... filter to delete one AppOrder
     *   }
     * })
     * 
     */
    delete<T extends AppOrderDeleteArgs>(args: SelectSubset<T, AppOrderDeleteArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AppOrder.
     * @param {AppOrderUpdateArgs} args - Arguments to update one AppOrder.
     * @example
     * // Update one AppOrder
     * const appOrder = await prisma.appOrder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AppOrderUpdateArgs>(args: SelectSubset<T, AppOrderUpdateArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AppOrders.
     * @param {AppOrderDeleteManyArgs} args - Arguments to filter AppOrders to delete.
     * @example
     * // Delete a few AppOrders
     * const { count } = await prisma.appOrder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AppOrderDeleteManyArgs>(args?: SelectSubset<T, AppOrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AppOrders
     * const appOrder = await prisma.appOrder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AppOrderUpdateManyArgs>(args: SelectSubset<T, AppOrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AppOrders and returns the data updated in the database.
     * @param {AppOrderUpdateManyAndReturnArgs} args - Arguments to update many AppOrders.
     * @example
     * // Update many AppOrders
     * const appOrder = await prisma.appOrder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AppOrders and only return the `id`
     * const appOrderWithIdOnly = await prisma.appOrder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AppOrderUpdateManyAndReturnArgs>(args: SelectSubset<T, AppOrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AppOrder.
     * @param {AppOrderUpsertArgs} args - Arguments to update or create a AppOrder.
     * @example
     * // Update or create a AppOrder
     * const appOrder = await prisma.appOrder.upsert({
     *   create: {
     *     // ... data to create a AppOrder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AppOrder we want to update
     *   }
     * })
     */
    upsert<T extends AppOrderUpsertArgs>(args: SelectSubset<T, AppOrderUpsertArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AppOrders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderCountArgs} args - Arguments to filter AppOrders to count.
     * @example
     * // Count the number of AppOrders
     * const count = await prisma.appOrder.count({
     *   where: {
     *     // ... the filter for the AppOrders we want to count
     *   }
     * })
    **/
    count<T extends AppOrderCountArgs>(
      args?: Subset<T, AppOrderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AppOrderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AppOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AppOrderAggregateArgs>(args: Subset<T, AppOrderAggregateArgs>): Prisma.PrismaPromise<GetAppOrderAggregateType<T>>

    /**
     * Group by AppOrder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AppOrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AppOrderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AppOrderGroupByArgs['orderBy'] }
        : { orderBy?: AppOrderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AppOrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAppOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AppOrder model
   */
  readonly fields: AppOrderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AppOrder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AppOrderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    revisions<T extends AppOrder$revisionsArgs<ExtArgs> = {}>(args?: Subset<T, AppOrder$revisionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    communications<T extends AppOrder$communicationsArgs<ExtArgs> = {}>(args?: Subset<T, AppOrder$communicationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AppOrder model
   */
  interface AppOrderFieldRefs {
    readonly id: FieldRef<"AppOrder", 'String'>
    readonly userId: FieldRef<"AppOrder", 'String'>
    readonly projectType: FieldRef<"AppOrder", 'String'>
    readonly title: FieldRef<"AppOrder", 'String'>
    readonly description: FieldRef<"AppOrder", 'String'>
    readonly requirements: FieldRef<"AppOrder", 'Json'>
    readonly timeline: FieldRef<"AppOrder", 'String'>
    readonly estimatedCost: FieldRef<"AppOrder", 'Float'>
    readonly currency: FieldRef<"AppOrder", 'String'>
    readonly status: FieldRef<"AppOrder", 'String'>
    readonly priority: FieldRef<"AppOrder", 'String'>
    readonly progressPercentage: FieldRef<"AppOrder", 'Int'>
    readonly completedAt: FieldRef<"AppOrder", 'DateTime'>
    readonly createdAt: FieldRef<"AppOrder", 'DateTime'>
    readonly updatedAt: FieldRef<"AppOrder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AppOrder findUnique
   */
  export type AppOrderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * Filter, which AppOrder to fetch.
     */
    where: AppOrderWhereUniqueInput
  }

  /**
   * AppOrder findUniqueOrThrow
   */
  export type AppOrderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * Filter, which AppOrder to fetch.
     */
    where: AppOrderWhereUniqueInput
  }

  /**
   * AppOrder findFirst
   */
  export type AppOrderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * Filter, which AppOrder to fetch.
     */
    where?: AppOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppOrders to fetch.
     */
    orderBy?: AppOrderOrderByWithRelationInput | AppOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppOrders.
     */
    cursor?: AppOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppOrders.
     */
    distinct?: AppOrderScalarFieldEnum | AppOrderScalarFieldEnum[]
  }

  /**
   * AppOrder findFirstOrThrow
   */
  export type AppOrderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * Filter, which AppOrder to fetch.
     */
    where?: AppOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppOrders to fetch.
     */
    orderBy?: AppOrderOrderByWithRelationInput | AppOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AppOrders.
     */
    cursor?: AppOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppOrders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AppOrders.
     */
    distinct?: AppOrderScalarFieldEnum | AppOrderScalarFieldEnum[]
  }

  /**
   * AppOrder findMany
   */
  export type AppOrderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * Filter, which AppOrders to fetch.
     */
    where?: AppOrderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AppOrders to fetch.
     */
    orderBy?: AppOrderOrderByWithRelationInput | AppOrderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AppOrders.
     */
    cursor?: AppOrderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AppOrders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AppOrders.
     */
    skip?: number
    distinct?: AppOrderScalarFieldEnum | AppOrderScalarFieldEnum[]
  }

  /**
   * AppOrder create
   */
  export type AppOrderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * The data needed to create a AppOrder.
     */
    data: XOR<AppOrderCreateInput, AppOrderUncheckedCreateInput>
  }

  /**
   * AppOrder createMany
   */
  export type AppOrderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AppOrders.
     */
    data: AppOrderCreateManyInput | AppOrderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AppOrder createManyAndReturn
   */
  export type AppOrderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * The data used to create many AppOrders.
     */
    data: AppOrderCreateManyInput | AppOrderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppOrder update
   */
  export type AppOrderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * The data needed to update a AppOrder.
     */
    data: XOR<AppOrderUpdateInput, AppOrderUncheckedUpdateInput>
    /**
     * Choose, which AppOrder to update.
     */
    where: AppOrderWhereUniqueInput
  }

  /**
   * AppOrder updateMany
   */
  export type AppOrderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AppOrders.
     */
    data: XOR<AppOrderUpdateManyMutationInput, AppOrderUncheckedUpdateManyInput>
    /**
     * Filter which AppOrders to update
     */
    where?: AppOrderWhereInput
    /**
     * Limit how many AppOrders to update.
     */
    limit?: number
  }

  /**
   * AppOrder updateManyAndReturn
   */
  export type AppOrderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * The data used to update AppOrders.
     */
    data: XOR<AppOrderUpdateManyMutationInput, AppOrderUncheckedUpdateManyInput>
    /**
     * Filter which AppOrders to update
     */
    where?: AppOrderWhereInput
    /**
     * Limit how many AppOrders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AppOrder upsert
   */
  export type AppOrderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * The filter to search for the AppOrder to update in case it exists.
     */
    where: AppOrderWhereUniqueInput
    /**
     * In case the AppOrder found by the `where` argument doesn't exist, create a new AppOrder with this data.
     */
    create: XOR<AppOrderCreateInput, AppOrderUncheckedCreateInput>
    /**
     * In case the AppOrder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AppOrderUpdateInput, AppOrderUncheckedUpdateInput>
  }

  /**
   * AppOrder delete
   */
  export type AppOrderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
    /**
     * Filter which AppOrder to delete.
     */
    where: AppOrderWhereUniqueInput
  }

  /**
   * AppOrder deleteMany
   */
  export type AppOrderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AppOrders to delete
     */
    where?: AppOrderWhereInput
    /**
     * Limit how many AppOrders to delete.
     */
    limit?: number
  }

  /**
   * AppOrder.revisions
   */
  export type AppOrder$revisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    where?: OrderRevisionWhereInput
    orderBy?: OrderRevisionOrderByWithRelationInput | OrderRevisionOrderByWithRelationInput[]
    cursor?: OrderRevisionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderRevisionScalarFieldEnum | OrderRevisionScalarFieldEnum[]
  }

  /**
   * AppOrder.communications
   */
  export type AppOrder$communicationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    where?: OrderCommunicationWhereInput
    orderBy?: OrderCommunicationOrderByWithRelationInput | OrderCommunicationOrderByWithRelationInput[]
    cursor?: OrderCommunicationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OrderCommunicationScalarFieldEnum | OrderCommunicationScalarFieldEnum[]
  }

  /**
   * AppOrder without action
   */
  export type AppOrderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AppOrder
     */
    select?: AppOrderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AppOrder
     */
    omit?: AppOrderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AppOrderInclude<ExtArgs> | null
  }


  /**
   * Model OrderRevision
   */

  export type AggregateOrderRevision = {
    _count: OrderRevisionCountAggregateOutputType | null
    _avg: OrderRevisionAvgAggregateOutputType | null
    _sum: OrderRevisionSumAggregateOutputType | null
    _min: OrderRevisionMinAggregateOutputType | null
    _max: OrderRevisionMaxAggregateOutputType | null
  }

  export type OrderRevisionAvgAggregateOutputType = {
    revisionNumber: number | null
  }

  export type OrderRevisionSumAggregateOutputType = {
    revisionNumber: number | null
  }

  export type OrderRevisionMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    userId: string | null
    revisionNumber: number | null
    title: string | null
    description: string | null
    status: string | null
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderRevisionMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    userId: string | null
    revisionNumber: number | null
    title: string | null
    description: string | null
    status: string | null
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderRevisionCountAggregateOutputType = {
    id: number
    orderId: number
    userId: number
    revisionNumber: number
    title: number
    description: number
    status: number
    approvedAt: number
    rejectedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderRevisionAvgAggregateInputType = {
    revisionNumber?: true
  }

  export type OrderRevisionSumAggregateInputType = {
    revisionNumber?: true
  }

  export type OrderRevisionMinAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    revisionNumber?: true
    title?: true
    description?: true
    status?: true
    approvedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderRevisionMaxAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    revisionNumber?: true
    title?: true
    description?: true
    status?: true
    approvedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderRevisionCountAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    revisionNumber?: true
    title?: true
    description?: true
    status?: true
    approvedAt?: true
    rejectedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderRevisionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderRevision to aggregate.
     */
    where?: OrderRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderRevisions to fetch.
     */
    orderBy?: OrderRevisionOrderByWithRelationInput | OrderRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderRevisions
    **/
    _count?: true | OrderRevisionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrderRevisionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrderRevisionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderRevisionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderRevisionMaxAggregateInputType
  }

  export type GetOrderRevisionAggregateType<T extends OrderRevisionAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderRevision]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderRevision[P]>
      : GetScalarType<T[P], AggregateOrderRevision[P]>
  }




  export type OrderRevisionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderRevisionWhereInput
    orderBy?: OrderRevisionOrderByWithAggregationInput | OrderRevisionOrderByWithAggregationInput[]
    by: OrderRevisionScalarFieldEnum[] | OrderRevisionScalarFieldEnum
    having?: OrderRevisionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderRevisionCountAggregateInputType | true
    _avg?: OrderRevisionAvgAggregateInputType
    _sum?: OrderRevisionSumAggregateInputType
    _min?: OrderRevisionMinAggregateInputType
    _max?: OrderRevisionMaxAggregateInputType
  }

  export type OrderRevisionGroupByOutputType = {
    id: string
    orderId: string
    userId: string
    revisionNumber: number
    title: string
    description: string
    status: string
    approvedAt: Date | null
    rejectedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: OrderRevisionCountAggregateOutputType | null
    _avg: OrderRevisionAvgAggregateOutputType | null
    _sum: OrderRevisionSumAggregateOutputType | null
    _min: OrderRevisionMinAggregateOutputType | null
    _max: OrderRevisionMaxAggregateOutputType | null
  }

  type GetOrderRevisionGroupByPayload<T extends OrderRevisionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderRevisionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderRevisionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderRevisionGroupByOutputType[P]>
            : GetScalarType<T[P], OrderRevisionGroupByOutputType[P]>
        }
      >
    >


  export type OrderRevisionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    revisionNumber?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderRevision"]>

  export type OrderRevisionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    revisionNumber?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderRevision"]>

  export type OrderRevisionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    revisionNumber?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderRevision"]>

  export type OrderRevisionSelectScalar = {
    id?: boolean
    orderId?: boolean
    userId?: boolean
    revisionNumber?: boolean
    title?: boolean
    description?: boolean
    status?: boolean
    approvedAt?: boolean
    rejectedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderRevisionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "userId" | "revisionNumber" | "title" | "description" | "status" | "approvedAt" | "rejectedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["orderRevision"]>
  export type OrderRevisionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderRevisionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderRevisionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OrderRevisionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderRevision"
    objects: {
      order: Prisma.$AppOrderPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      userId: string
      revisionNumber: number
      title: string
      description: string
      status: string
      approvedAt: Date | null
      rejectedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["orderRevision"]>
    composites: {}
  }

  type OrderRevisionGetPayload<S extends boolean | null | undefined | OrderRevisionDefaultArgs> = $Result.GetResult<Prisma.$OrderRevisionPayload, S>

  type OrderRevisionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderRevisionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderRevisionCountAggregateInputType | true
    }

  export interface OrderRevisionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderRevision'], meta: { name: 'OrderRevision' } }
    /**
     * Find zero or one OrderRevision that matches the filter.
     * @param {OrderRevisionFindUniqueArgs} args - Arguments to find a OrderRevision
     * @example
     * // Get one OrderRevision
     * const orderRevision = await prisma.orderRevision.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderRevisionFindUniqueArgs>(args: SelectSubset<T, OrderRevisionFindUniqueArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderRevision that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderRevisionFindUniqueOrThrowArgs} args - Arguments to find a OrderRevision
     * @example
     * // Get one OrderRevision
     * const orderRevision = await prisma.orderRevision.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderRevisionFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderRevisionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderRevision that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionFindFirstArgs} args - Arguments to find a OrderRevision
     * @example
     * // Get one OrderRevision
     * const orderRevision = await prisma.orderRevision.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderRevisionFindFirstArgs>(args?: SelectSubset<T, OrderRevisionFindFirstArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderRevision that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionFindFirstOrThrowArgs} args - Arguments to find a OrderRevision
     * @example
     * // Get one OrderRevision
     * const orderRevision = await prisma.orderRevision.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderRevisionFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderRevisionFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderRevisions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderRevisions
     * const orderRevisions = await prisma.orderRevision.findMany()
     * 
     * // Get first 10 OrderRevisions
     * const orderRevisions = await prisma.orderRevision.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderRevisionWithIdOnly = await prisma.orderRevision.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderRevisionFindManyArgs>(args?: SelectSubset<T, OrderRevisionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderRevision.
     * @param {OrderRevisionCreateArgs} args - Arguments to create a OrderRevision.
     * @example
     * // Create one OrderRevision
     * const OrderRevision = await prisma.orderRevision.create({
     *   data: {
     *     // ... data to create a OrderRevision
     *   }
     * })
     * 
     */
    create<T extends OrderRevisionCreateArgs>(args: SelectSubset<T, OrderRevisionCreateArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderRevisions.
     * @param {OrderRevisionCreateManyArgs} args - Arguments to create many OrderRevisions.
     * @example
     * // Create many OrderRevisions
     * const orderRevision = await prisma.orderRevision.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderRevisionCreateManyArgs>(args?: SelectSubset<T, OrderRevisionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderRevisions and returns the data saved in the database.
     * @param {OrderRevisionCreateManyAndReturnArgs} args - Arguments to create many OrderRevisions.
     * @example
     * // Create many OrderRevisions
     * const orderRevision = await prisma.orderRevision.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderRevisions and only return the `id`
     * const orderRevisionWithIdOnly = await prisma.orderRevision.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderRevisionCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderRevisionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderRevision.
     * @param {OrderRevisionDeleteArgs} args - Arguments to delete one OrderRevision.
     * @example
     * // Delete one OrderRevision
     * const OrderRevision = await prisma.orderRevision.delete({
     *   where: {
     *     // ... filter to delete one OrderRevision
     *   }
     * })
     * 
     */
    delete<T extends OrderRevisionDeleteArgs>(args: SelectSubset<T, OrderRevisionDeleteArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderRevision.
     * @param {OrderRevisionUpdateArgs} args - Arguments to update one OrderRevision.
     * @example
     * // Update one OrderRevision
     * const orderRevision = await prisma.orderRevision.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderRevisionUpdateArgs>(args: SelectSubset<T, OrderRevisionUpdateArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderRevisions.
     * @param {OrderRevisionDeleteManyArgs} args - Arguments to filter OrderRevisions to delete.
     * @example
     * // Delete a few OrderRevisions
     * const { count } = await prisma.orderRevision.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderRevisionDeleteManyArgs>(args?: SelectSubset<T, OrderRevisionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderRevisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderRevisions
     * const orderRevision = await prisma.orderRevision.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderRevisionUpdateManyArgs>(args: SelectSubset<T, OrderRevisionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderRevisions and returns the data updated in the database.
     * @param {OrderRevisionUpdateManyAndReturnArgs} args - Arguments to update many OrderRevisions.
     * @example
     * // Update many OrderRevisions
     * const orderRevision = await prisma.orderRevision.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderRevisions and only return the `id`
     * const orderRevisionWithIdOnly = await prisma.orderRevision.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderRevisionUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderRevisionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderRevision.
     * @param {OrderRevisionUpsertArgs} args - Arguments to update or create a OrderRevision.
     * @example
     * // Update or create a OrderRevision
     * const orderRevision = await prisma.orderRevision.upsert({
     *   create: {
     *     // ... data to create a OrderRevision
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderRevision we want to update
     *   }
     * })
     */
    upsert<T extends OrderRevisionUpsertArgs>(args: SelectSubset<T, OrderRevisionUpsertArgs<ExtArgs>>): Prisma__OrderRevisionClient<$Result.GetResult<Prisma.$OrderRevisionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderRevisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionCountArgs} args - Arguments to filter OrderRevisions to count.
     * @example
     * // Count the number of OrderRevisions
     * const count = await prisma.orderRevision.count({
     *   where: {
     *     // ... the filter for the OrderRevisions we want to count
     *   }
     * })
    **/
    count<T extends OrderRevisionCountArgs>(
      args?: Subset<T, OrderRevisionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderRevisionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderRevision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderRevisionAggregateArgs>(args: Subset<T, OrderRevisionAggregateArgs>): Prisma.PrismaPromise<GetOrderRevisionAggregateType<T>>

    /**
     * Group by OrderRevision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderRevisionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderRevisionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderRevisionGroupByArgs['orderBy'] }
        : { orderBy?: OrderRevisionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderRevisionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderRevisionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderRevision model
   */
  readonly fields: OrderRevisionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderRevision.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderRevisionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends AppOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppOrderDefaultArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderRevision model
   */
  interface OrderRevisionFieldRefs {
    readonly id: FieldRef<"OrderRevision", 'String'>
    readonly orderId: FieldRef<"OrderRevision", 'String'>
    readonly userId: FieldRef<"OrderRevision", 'String'>
    readonly revisionNumber: FieldRef<"OrderRevision", 'Int'>
    readonly title: FieldRef<"OrderRevision", 'String'>
    readonly description: FieldRef<"OrderRevision", 'String'>
    readonly status: FieldRef<"OrderRevision", 'String'>
    readonly approvedAt: FieldRef<"OrderRevision", 'DateTime'>
    readonly rejectedAt: FieldRef<"OrderRevision", 'DateTime'>
    readonly createdAt: FieldRef<"OrderRevision", 'DateTime'>
    readonly updatedAt: FieldRef<"OrderRevision", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrderRevision findUnique
   */
  export type OrderRevisionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * Filter, which OrderRevision to fetch.
     */
    where: OrderRevisionWhereUniqueInput
  }

  /**
   * OrderRevision findUniqueOrThrow
   */
  export type OrderRevisionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * Filter, which OrderRevision to fetch.
     */
    where: OrderRevisionWhereUniqueInput
  }

  /**
   * OrderRevision findFirst
   */
  export type OrderRevisionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * Filter, which OrderRevision to fetch.
     */
    where?: OrderRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderRevisions to fetch.
     */
    orderBy?: OrderRevisionOrderByWithRelationInput | OrderRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderRevisions.
     */
    cursor?: OrderRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderRevisions.
     */
    distinct?: OrderRevisionScalarFieldEnum | OrderRevisionScalarFieldEnum[]
  }

  /**
   * OrderRevision findFirstOrThrow
   */
  export type OrderRevisionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * Filter, which OrderRevision to fetch.
     */
    where?: OrderRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderRevisions to fetch.
     */
    orderBy?: OrderRevisionOrderByWithRelationInput | OrderRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderRevisions.
     */
    cursor?: OrderRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderRevisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderRevisions.
     */
    distinct?: OrderRevisionScalarFieldEnum | OrderRevisionScalarFieldEnum[]
  }

  /**
   * OrderRevision findMany
   */
  export type OrderRevisionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * Filter, which OrderRevisions to fetch.
     */
    where?: OrderRevisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderRevisions to fetch.
     */
    orderBy?: OrderRevisionOrderByWithRelationInput | OrderRevisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderRevisions.
     */
    cursor?: OrderRevisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderRevisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderRevisions.
     */
    skip?: number
    distinct?: OrderRevisionScalarFieldEnum | OrderRevisionScalarFieldEnum[]
  }

  /**
   * OrderRevision create
   */
  export type OrderRevisionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderRevision.
     */
    data: XOR<OrderRevisionCreateInput, OrderRevisionUncheckedCreateInput>
  }

  /**
   * OrderRevision createMany
   */
  export type OrderRevisionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderRevisions.
     */
    data: OrderRevisionCreateManyInput | OrderRevisionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderRevision createManyAndReturn
   */
  export type OrderRevisionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * The data used to create many OrderRevisions.
     */
    data: OrderRevisionCreateManyInput | OrderRevisionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderRevision update
   */
  export type OrderRevisionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderRevision.
     */
    data: XOR<OrderRevisionUpdateInput, OrderRevisionUncheckedUpdateInput>
    /**
     * Choose, which OrderRevision to update.
     */
    where: OrderRevisionWhereUniqueInput
  }

  /**
   * OrderRevision updateMany
   */
  export type OrderRevisionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderRevisions.
     */
    data: XOR<OrderRevisionUpdateManyMutationInput, OrderRevisionUncheckedUpdateManyInput>
    /**
     * Filter which OrderRevisions to update
     */
    where?: OrderRevisionWhereInput
    /**
     * Limit how many OrderRevisions to update.
     */
    limit?: number
  }

  /**
   * OrderRevision updateManyAndReturn
   */
  export type OrderRevisionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * The data used to update OrderRevisions.
     */
    data: XOR<OrderRevisionUpdateManyMutationInput, OrderRevisionUncheckedUpdateManyInput>
    /**
     * Filter which OrderRevisions to update
     */
    where?: OrderRevisionWhereInput
    /**
     * Limit how many OrderRevisions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderRevision upsert
   */
  export type OrderRevisionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderRevision to update in case it exists.
     */
    where: OrderRevisionWhereUniqueInput
    /**
     * In case the OrderRevision found by the `where` argument doesn't exist, create a new OrderRevision with this data.
     */
    create: XOR<OrderRevisionCreateInput, OrderRevisionUncheckedCreateInput>
    /**
     * In case the OrderRevision was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderRevisionUpdateInput, OrderRevisionUncheckedUpdateInput>
  }

  /**
   * OrderRevision delete
   */
  export type OrderRevisionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
    /**
     * Filter which OrderRevision to delete.
     */
    where: OrderRevisionWhereUniqueInput
  }

  /**
   * OrderRevision deleteMany
   */
  export type OrderRevisionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderRevisions to delete
     */
    where?: OrderRevisionWhereInput
    /**
     * Limit how many OrderRevisions to delete.
     */
    limit?: number
  }

  /**
   * OrderRevision without action
   */
  export type OrderRevisionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderRevision
     */
    select?: OrderRevisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderRevision
     */
    omit?: OrderRevisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderRevisionInclude<ExtArgs> | null
  }


  /**
   * Model OrderCommunication
   */

  export type AggregateOrderCommunication = {
    _count: OrderCommunicationCountAggregateOutputType | null
    _min: OrderCommunicationMinAggregateOutputType | null
    _max: OrderCommunicationMaxAggregateOutputType | null
  }

  export type OrderCommunicationMinAggregateOutputType = {
    id: string | null
    orderId: string | null
    userId: string | null
    messageType: string | null
    subject: string | null
    message: string | null
    isFromAdmin: boolean | null
    read: boolean | null
    important: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCommunicationMaxAggregateOutputType = {
    id: string | null
    orderId: string | null
    userId: string | null
    messageType: string | null
    subject: string | null
    message: string | null
    isFromAdmin: boolean | null
    read: boolean | null
    important: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrderCommunicationCountAggregateOutputType = {
    id: number
    orderId: number
    userId: number
    messageType: number
    subject: number
    message: number
    isFromAdmin: number
    read: number
    important: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrderCommunicationMinAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    messageType?: true
    subject?: true
    message?: true
    isFromAdmin?: true
    read?: true
    important?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCommunicationMaxAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    messageType?: true
    subject?: true
    message?: true
    isFromAdmin?: true
    read?: true
    important?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrderCommunicationCountAggregateInputType = {
    id?: true
    orderId?: true
    userId?: true
    messageType?: true
    subject?: true
    message?: true
    isFromAdmin?: true
    read?: true
    important?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrderCommunicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderCommunication to aggregate.
     */
    where?: OrderCommunicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderCommunications to fetch.
     */
    orderBy?: OrderCommunicationOrderByWithRelationInput | OrderCommunicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrderCommunicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderCommunications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderCommunications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OrderCommunications
    **/
    _count?: true | OrderCommunicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrderCommunicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrderCommunicationMaxAggregateInputType
  }

  export type GetOrderCommunicationAggregateType<T extends OrderCommunicationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrderCommunication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrderCommunication[P]>
      : GetScalarType<T[P], AggregateOrderCommunication[P]>
  }




  export type OrderCommunicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrderCommunicationWhereInput
    orderBy?: OrderCommunicationOrderByWithAggregationInput | OrderCommunicationOrderByWithAggregationInput[]
    by: OrderCommunicationScalarFieldEnum[] | OrderCommunicationScalarFieldEnum
    having?: OrderCommunicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrderCommunicationCountAggregateInputType | true
    _min?: OrderCommunicationMinAggregateInputType
    _max?: OrderCommunicationMaxAggregateInputType
  }

  export type OrderCommunicationGroupByOutputType = {
    id: string
    orderId: string
    userId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin: boolean
    read: boolean
    important: boolean
    createdAt: Date
    updatedAt: Date
    _count: OrderCommunicationCountAggregateOutputType | null
    _min: OrderCommunicationMinAggregateOutputType | null
    _max: OrderCommunicationMaxAggregateOutputType | null
  }

  type GetOrderCommunicationGroupByPayload<T extends OrderCommunicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrderCommunicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrderCommunicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrderCommunicationGroupByOutputType[P]>
            : GetScalarType<T[P], OrderCommunicationGroupByOutputType[P]>
        }
      >
    >


  export type OrderCommunicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    messageType?: boolean
    subject?: boolean
    message?: boolean
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderCommunication"]>

  export type OrderCommunicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    messageType?: boolean
    subject?: boolean
    message?: boolean
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderCommunication"]>

  export type OrderCommunicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    orderId?: boolean
    userId?: boolean
    messageType?: boolean
    subject?: boolean
    message?: boolean
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["orderCommunication"]>

  export type OrderCommunicationSelectScalar = {
    id?: boolean
    orderId?: boolean
    userId?: boolean
    messageType?: boolean
    subject?: boolean
    message?: boolean
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrderCommunicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "orderId" | "userId" | "messageType" | "subject" | "message" | "isFromAdmin" | "read" | "important" | "createdAt" | "updatedAt", ExtArgs["result"]["orderCommunication"]>
  export type OrderCommunicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderCommunicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type OrderCommunicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    order?: boolean | AppOrderDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $OrderCommunicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OrderCommunication"
    objects: {
      order: Prisma.$AppOrderPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      orderId: string
      userId: string
      messageType: string
      subject: string
      message: string
      isFromAdmin: boolean
      read: boolean
      important: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["orderCommunication"]>
    composites: {}
  }

  type OrderCommunicationGetPayload<S extends boolean | null | undefined | OrderCommunicationDefaultArgs> = $Result.GetResult<Prisma.$OrderCommunicationPayload, S>

  type OrderCommunicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrderCommunicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrderCommunicationCountAggregateInputType | true
    }

  export interface OrderCommunicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OrderCommunication'], meta: { name: 'OrderCommunication' } }
    /**
     * Find zero or one OrderCommunication that matches the filter.
     * @param {OrderCommunicationFindUniqueArgs} args - Arguments to find a OrderCommunication
     * @example
     * // Get one OrderCommunication
     * const orderCommunication = await prisma.orderCommunication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderCommunicationFindUniqueArgs>(args: SelectSubset<T, OrderCommunicationFindUniqueArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OrderCommunication that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderCommunicationFindUniqueOrThrowArgs} args - Arguments to find a OrderCommunication
     * @example
     * // Get one OrderCommunication
     * const orderCommunication = await prisma.orderCommunication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderCommunicationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrderCommunicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderCommunication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationFindFirstArgs} args - Arguments to find a OrderCommunication
     * @example
     * // Get one OrderCommunication
     * const orderCommunication = await prisma.orderCommunication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderCommunicationFindFirstArgs>(args?: SelectSubset<T, OrderCommunicationFindFirstArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OrderCommunication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationFindFirstOrThrowArgs} args - Arguments to find a OrderCommunication
     * @example
     * // Get one OrderCommunication
     * const orderCommunication = await prisma.orderCommunication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderCommunicationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrderCommunicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OrderCommunications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OrderCommunications
     * const orderCommunications = await prisma.orderCommunication.findMany()
     * 
     * // Get first 10 OrderCommunications
     * const orderCommunications = await prisma.orderCommunication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const orderCommunicationWithIdOnly = await prisma.orderCommunication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrderCommunicationFindManyArgs>(args?: SelectSubset<T, OrderCommunicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OrderCommunication.
     * @param {OrderCommunicationCreateArgs} args - Arguments to create a OrderCommunication.
     * @example
     * // Create one OrderCommunication
     * const OrderCommunication = await prisma.orderCommunication.create({
     *   data: {
     *     // ... data to create a OrderCommunication
     *   }
     * })
     * 
     */
    create<T extends OrderCommunicationCreateArgs>(args: SelectSubset<T, OrderCommunicationCreateArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OrderCommunications.
     * @param {OrderCommunicationCreateManyArgs} args - Arguments to create many OrderCommunications.
     * @example
     * // Create many OrderCommunications
     * const orderCommunication = await prisma.orderCommunication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrderCommunicationCreateManyArgs>(args?: SelectSubset<T, OrderCommunicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OrderCommunications and returns the data saved in the database.
     * @param {OrderCommunicationCreateManyAndReturnArgs} args - Arguments to create many OrderCommunications.
     * @example
     * // Create many OrderCommunications
     * const orderCommunication = await prisma.orderCommunication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many OrderCommunications and only return the `id`
     * const orderCommunicationWithIdOnly = await prisma.orderCommunication.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrderCommunicationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrderCommunicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a OrderCommunication.
     * @param {OrderCommunicationDeleteArgs} args - Arguments to delete one OrderCommunication.
     * @example
     * // Delete one OrderCommunication
     * const OrderCommunication = await prisma.orderCommunication.delete({
     *   where: {
     *     // ... filter to delete one OrderCommunication
     *   }
     * })
     * 
     */
    delete<T extends OrderCommunicationDeleteArgs>(args: SelectSubset<T, OrderCommunicationDeleteArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OrderCommunication.
     * @param {OrderCommunicationUpdateArgs} args - Arguments to update one OrderCommunication.
     * @example
     * // Update one OrderCommunication
     * const orderCommunication = await prisma.orderCommunication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrderCommunicationUpdateArgs>(args: SelectSubset<T, OrderCommunicationUpdateArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OrderCommunications.
     * @param {OrderCommunicationDeleteManyArgs} args - Arguments to filter OrderCommunications to delete.
     * @example
     * // Delete a few OrderCommunications
     * const { count } = await prisma.orderCommunication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrderCommunicationDeleteManyArgs>(args?: SelectSubset<T, OrderCommunicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderCommunications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OrderCommunications
     * const orderCommunication = await prisma.orderCommunication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrderCommunicationUpdateManyArgs>(args: SelectSubset<T, OrderCommunicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OrderCommunications and returns the data updated in the database.
     * @param {OrderCommunicationUpdateManyAndReturnArgs} args - Arguments to update many OrderCommunications.
     * @example
     * // Update many OrderCommunications
     * const orderCommunication = await prisma.orderCommunication.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more OrderCommunications and only return the `id`
     * const orderCommunicationWithIdOnly = await prisma.orderCommunication.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrderCommunicationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrderCommunicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one OrderCommunication.
     * @param {OrderCommunicationUpsertArgs} args - Arguments to update or create a OrderCommunication.
     * @example
     * // Update or create a OrderCommunication
     * const orderCommunication = await prisma.orderCommunication.upsert({
     *   create: {
     *     // ... data to create a OrderCommunication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OrderCommunication we want to update
     *   }
     * })
     */
    upsert<T extends OrderCommunicationUpsertArgs>(args: SelectSubset<T, OrderCommunicationUpsertArgs<ExtArgs>>): Prisma__OrderCommunicationClient<$Result.GetResult<Prisma.$OrderCommunicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OrderCommunications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationCountArgs} args - Arguments to filter OrderCommunications to count.
     * @example
     * // Count the number of OrderCommunications
     * const count = await prisma.orderCommunication.count({
     *   where: {
     *     // ... the filter for the OrderCommunications we want to count
     *   }
     * })
    **/
    count<T extends OrderCommunicationCountArgs>(
      args?: Subset<T, OrderCommunicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrderCommunicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OrderCommunication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderCommunicationAggregateArgs>(args: Subset<T, OrderCommunicationAggregateArgs>): Prisma.PrismaPromise<GetOrderCommunicationAggregateType<T>>

    /**
     * Group by OrderCommunication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCommunicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrderCommunicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrderCommunicationGroupByArgs['orderBy'] }
        : { orderBy?: OrderCommunicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrderCommunicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderCommunicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OrderCommunication model
   */
  readonly fields: OrderCommunicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OrderCommunication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrderCommunicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    order<T extends AppOrderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AppOrderDefaultArgs<ExtArgs>>): Prisma__AppOrderClient<$Result.GetResult<Prisma.$AppOrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the OrderCommunication model
   */
  interface OrderCommunicationFieldRefs {
    readonly id: FieldRef<"OrderCommunication", 'String'>
    readonly orderId: FieldRef<"OrderCommunication", 'String'>
    readonly userId: FieldRef<"OrderCommunication", 'String'>
    readonly messageType: FieldRef<"OrderCommunication", 'String'>
    readonly subject: FieldRef<"OrderCommunication", 'String'>
    readonly message: FieldRef<"OrderCommunication", 'String'>
    readonly isFromAdmin: FieldRef<"OrderCommunication", 'Boolean'>
    readonly read: FieldRef<"OrderCommunication", 'Boolean'>
    readonly important: FieldRef<"OrderCommunication", 'Boolean'>
    readonly createdAt: FieldRef<"OrderCommunication", 'DateTime'>
    readonly updatedAt: FieldRef<"OrderCommunication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OrderCommunication findUnique
   */
  export type OrderCommunicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * Filter, which OrderCommunication to fetch.
     */
    where: OrderCommunicationWhereUniqueInput
  }

  /**
   * OrderCommunication findUniqueOrThrow
   */
  export type OrderCommunicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * Filter, which OrderCommunication to fetch.
     */
    where: OrderCommunicationWhereUniqueInput
  }

  /**
   * OrderCommunication findFirst
   */
  export type OrderCommunicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * Filter, which OrderCommunication to fetch.
     */
    where?: OrderCommunicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderCommunications to fetch.
     */
    orderBy?: OrderCommunicationOrderByWithRelationInput | OrderCommunicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderCommunications.
     */
    cursor?: OrderCommunicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderCommunications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderCommunications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderCommunications.
     */
    distinct?: OrderCommunicationScalarFieldEnum | OrderCommunicationScalarFieldEnum[]
  }

  /**
   * OrderCommunication findFirstOrThrow
   */
  export type OrderCommunicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * Filter, which OrderCommunication to fetch.
     */
    where?: OrderCommunicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderCommunications to fetch.
     */
    orderBy?: OrderCommunicationOrderByWithRelationInput | OrderCommunicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OrderCommunications.
     */
    cursor?: OrderCommunicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderCommunications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderCommunications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OrderCommunications.
     */
    distinct?: OrderCommunicationScalarFieldEnum | OrderCommunicationScalarFieldEnum[]
  }

  /**
   * OrderCommunication findMany
   */
  export type OrderCommunicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * Filter, which OrderCommunications to fetch.
     */
    where?: OrderCommunicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OrderCommunications to fetch.
     */
    orderBy?: OrderCommunicationOrderByWithRelationInput | OrderCommunicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OrderCommunications.
     */
    cursor?: OrderCommunicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OrderCommunications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OrderCommunications.
     */
    skip?: number
    distinct?: OrderCommunicationScalarFieldEnum | OrderCommunicationScalarFieldEnum[]
  }

  /**
   * OrderCommunication create
   */
  export type OrderCommunicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * The data needed to create a OrderCommunication.
     */
    data: XOR<OrderCommunicationCreateInput, OrderCommunicationUncheckedCreateInput>
  }

  /**
   * OrderCommunication createMany
   */
  export type OrderCommunicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OrderCommunications.
     */
    data: OrderCommunicationCreateManyInput | OrderCommunicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OrderCommunication createManyAndReturn
   */
  export type OrderCommunicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * The data used to create many OrderCommunications.
     */
    data: OrderCommunicationCreateManyInput | OrderCommunicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderCommunication update
   */
  export type OrderCommunicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * The data needed to update a OrderCommunication.
     */
    data: XOR<OrderCommunicationUpdateInput, OrderCommunicationUncheckedUpdateInput>
    /**
     * Choose, which OrderCommunication to update.
     */
    where: OrderCommunicationWhereUniqueInput
  }

  /**
   * OrderCommunication updateMany
   */
  export type OrderCommunicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OrderCommunications.
     */
    data: XOR<OrderCommunicationUpdateManyMutationInput, OrderCommunicationUncheckedUpdateManyInput>
    /**
     * Filter which OrderCommunications to update
     */
    where?: OrderCommunicationWhereInput
    /**
     * Limit how many OrderCommunications to update.
     */
    limit?: number
  }

  /**
   * OrderCommunication updateManyAndReturn
   */
  export type OrderCommunicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * The data used to update OrderCommunications.
     */
    data: XOR<OrderCommunicationUpdateManyMutationInput, OrderCommunicationUncheckedUpdateManyInput>
    /**
     * Filter which OrderCommunications to update
     */
    where?: OrderCommunicationWhereInput
    /**
     * Limit how many OrderCommunications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * OrderCommunication upsert
   */
  export type OrderCommunicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * The filter to search for the OrderCommunication to update in case it exists.
     */
    where: OrderCommunicationWhereUniqueInput
    /**
     * In case the OrderCommunication found by the `where` argument doesn't exist, create a new OrderCommunication with this data.
     */
    create: XOR<OrderCommunicationCreateInput, OrderCommunicationUncheckedCreateInput>
    /**
     * In case the OrderCommunication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrderCommunicationUpdateInput, OrderCommunicationUncheckedUpdateInput>
  }

  /**
   * OrderCommunication delete
   */
  export type OrderCommunicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
    /**
     * Filter which OrderCommunication to delete.
     */
    where: OrderCommunicationWhereUniqueInput
  }

  /**
   * OrderCommunication deleteMany
   */
  export type OrderCommunicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OrderCommunications to delete
     */
    where?: OrderCommunicationWhereInput
    /**
     * Limit how many OrderCommunications to delete.
     */
    limit?: number
  }

  /**
   * OrderCommunication without action
   */
  export type OrderCommunicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrderCommunication
     */
    select?: OrderCommunicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OrderCommunication
     */
    omit?: OrderCommunicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrderCommunicationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    eceBalance: 'eceBalance',
    refreshToken: 'refreshToken',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const CardScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    imageUrl: 'imageUrl',
    rarity: 'rarity',
    category: 'category',
    company: 'company',
    valuation: 'valuation',
    marketCap: 'marketCap',
    volume24h: 'volume24h',
    priceChange24h: 'priceChange24h',
    attributes: 'attributes',
    metadata: 'metadata',
    ownerId: 'ownerId',
    isListed: 'isListed',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CardScalarFieldEnum = (typeof CardScalarFieldEnum)[keyof typeof CardScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    fromUserId: 'fromUserId',
    toUserId: 'toUserId',
    cardId: 'cardId',
    amount: 'amount',
    currency: 'currency',
    type: 'type',
    status: 'status',
    reference: 'reference',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const TradeOfferScalarFieldEnum: {
    id: 'id',
    senderId: 'senderId',
    receiverId: 'receiverId',
    status: 'status',
    message: 'message',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TradeOfferScalarFieldEnum = (typeof TradeOfferScalarFieldEnum)[keyof typeof TradeOfferScalarFieldEnum]


  export const TradeOfferItemScalarFieldEnum: {
    id: 'id',
    tradeOfferId: 'tradeOfferId',
    cardId: 'cardId',
    role: 'role',
    quantity: 'quantity',
    createdAt: 'createdAt'
  };

  export type TradeOfferItemScalarFieldEnum = (typeof TradeOfferItemScalarFieldEnum)[keyof typeof TradeOfferItemScalarFieldEnum]


  export const AppOrderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectType: 'projectType',
    title: 'title',
    description: 'description',
    requirements: 'requirements',
    timeline: 'timeline',
    estimatedCost: 'estimatedCost',
    currency: 'currency',
    status: 'status',
    priority: 'priority',
    progressPercentage: 'progressPercentage',
    completedAt: 'completedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AppOrderScalarFieldEnum = (typeof AppOrderScalarFieldEnum)[keyof typeof AppOrderScalarFieldEnum]


  export const OrderRevisionScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    userId: 'userId',
    revisionNumber: 'revisionNumber',
    title: 'title',
    description: 'description',
    status: 'status',
    approvedAt: 'approvedAt',
    rejectedAt: 'rejectedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderRevisionScalarFieldEnum = (typeof OrderRevisionScalarFieldEnum)[keyof typeof OrderRevisionScalarFieldEnum]


  export const OrderCommunicationScalarFieldEnum: {
    id: 'id',
    orderId: 'orderId',
    userId: 'userId',
    messageType: 'messageType',
    subject: 'subject',
    message: 'message',
    isFromAdmin: 'isFromAdmin',
    read: 'read',
    important: 'important',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrderCommunicationScalarFieldEnum = (typeof OrderCommunicationScalarFieldEnum)[keyof typeof OrderCommunicationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'TradeOfferStatus'
   */
  export type EnumTradeOfferStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeOfferStatus'>
    


  /**
   * Reference to a field of type 'TradeOfferStatus[]'
   */
  export type ListEnumTradeOfferStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeOfferStatus[]'>
    


  /**
   * Reference to a field of type 'TradeOfferItemRole'
   */
  export type EnumTradeOfferItemRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeOfferItemRole'>
    


  /**
   * Reference to a field of type 'TradeOfferItemRole[]'
   */
  export type ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TradeOfferItemRole[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    eceBalance?: FloatFilter<"User"> | number
    refreshToken?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    cards?: CardListRelationFilter
    transactionsFrom?: TransactionListRelationFilter
    transactionsTo?: TransactionListRelationFilter
    tradeOffersSent?: TradeOfferListRelationFilter
    tradeOffersReceived?: TradeOfferListRelationFilter
    appOrders?: AppOrderListRelationFilter
    orderRevisions?: OrderRevisionListRelationFilter
    orderCommunications?: OrderCommunicationListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    eceBalance?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    cards?: CardOrderByRelationAggregateInput
    transactionsFrom?: TransactionOrderByRelationAggregateInput
    transactionsTo?: TransactionOrderByRelationAggregateInput
    tradeOffersSent?: TradeOfferOrderByRelationAggregateInput
    tradeOffersReceived?: TradeOfferOrderByRelationAggregateInput
    appOrders?: AppOrderOrderByRelationAggregateInput
    orderRevisions?: OrderRevisionOrderByRelationAggregateInput
    orderCommunications?: OrderCommunicationOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringNullableFilter<"User"> | string | null
    eceBalance?: FloatFilter<"User"> | number
    refreshToken?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    cards?: CardListRelationFilter
    transactionsFrom?: TransactionListRelationFilter
    transactionsTo?: TransactionListRelationFilter
    tradeOffersSent?: TradeOfferListRelationFilter
    tradeOffersReceived?: TradeOfferListRelationFilter
    appOrders?: AppOrderListRelationFilter
    orderRevisions?: OrderRevisionListRelationFilter
    orderCommunications?: OrderCommunicationListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrderInput | SortOrder
    eceBalance?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    eceBalance?: FloatWithAggregatesFilter<"User"> | number
    refreshToken?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type CardWhereInput = {
    AND?: CardWhereInput | CardWhereInput[]
    OR?: CardWhereInput[]
    NOT?: CardWhereInput | CardWhereInput[]
    id?: StringFilter<"Card"> | string
    name?: StringFilter<"Card"> | string
    description?: StringFilter<"Card"> | string
    imageUrl?: StringFilter<"Card"> | string
    rarity?: StringFilter<"Card"> | string
    category?: StringFilter<"Card"> | string
    company?: StringFilter<"Card"> | string
    valuation?: FloatFilter<"Card"> | number
    marketCap?: FloatNullableFilter<"Card"> | number | null
    volume24h?: FloatFilter<"Card"> | number
    priceChange24h?: FloatFilter<"Card"> | number
    attributes?: JsonFilter<"Card">
    metadata?: JsonFilter<"Card">
    ownerId?: StringNullableFilter<"Card"> | string | null
    isListed?: BoolFilter<"Card"> | boolean
    createdAt?: DateTimeFilter<"Card"> | Date | string
    updatedAt?: DateTimeFilter<"Card"> | Date | string
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    transactions?: TransactionListRelationFilter
    tradeOfferItems?: TradeOfferItemListRelationFilter
  }

  export type CardOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    rarity?: SortOrder
    category?: SortOrder
    company?: SortOrder
    valuation?: SortOrder
    marketCap?: SortOrderInput | SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
    attributes?: SortOrder
    metadata?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    isListed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    transactions?: TransactionOrderByRelationAggregateInput
    tradeOfferItems?: TradeOfferItemOrderByRelationAggregateInput
  }

  export type CardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CardWhereInput | CardWhereInput[]
    OR?: CardWhereInput[]
    NOT?: CardWhereInput | CardWhereInput[]
    name?: StringFilter<"Card"> | string
    description?: StringFilter<"Card"> | string
    imageUrl?: StringFilter<"Card"> | string
    rarity?: StringFilter<"Card"> | string
    category?: StringFilter<"Card"> | string
    company?: StringFilter<"Card"> | string
    valuation?: FloatFilter<"Card"> | number
    marketCap?: FloatNullableFilter<"Card"> | number | null
    volume24h?: FloatFilter<"Card"> | number
    priceChange24h?: FloatFilter<"Card"> | number
    attributes?: JsonFilter<"Card">
    metadata?: JsonFilter<"Card">
    ownerId?: StringNullableFilter<"Card"> | string | null
    isListed?: BoolFilter<"Card"> | boolean
    createdAt?: DateTimeFilter<"Card"> | Date | string
    updatedAt?: DateTimeFilter<"Card"> | Date | string
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    transactions?: TransactionListRelationFilter
    tradeOfferItems?: TradeOfferItemListRelationFilter
  }, "id">

  export type CardOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    rarity?: SortOrder
    category?: SortOrder
    company?: SortOrder
    valuation?: SortOrder
    marketCap?: SortOrderInput | SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
    attributes?: SortOrder
    metadata?: SortOrder
    ownerId?: SortOrderInput | SortOrder
    isListed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CardCountOrderByAggregateInput
    _avg?: CardAvgOrderByAggregateInput
    _max?: CardMaxOrderByAggregateInput
    _min?: CardMinOrderByAggregateInput
    _sum?: CardSumOrderByAggregateInput
  }

  export type CardScalarWhereWithAggregatesInput = {
    AND?: CardScalarWhereWithAggregatesInput | CardScalarWhereWithAggregatesInput[]
    OR?: CardScalarWhereWithAggregatesInput[]
    NOT?: CardScalarWhereWithAggregatesInput | CardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Card"> | string
    name?: StringWithAggregatesFilter<"Card"> | string
    description?: StringWithAggregatesFilter<"Card"> | string
    imageUrl?: StringWithAggregatesFilter<"Card"> | string
    rarity?: StringWithAggregatesFilter<"Card"> | string
    category?: StringWithAggregatesFilter<"Card"> | string
    company?: StringWithAggregatesFilter<"Card"> | string
    valuation?: FloatWithAggregatesFilter<"Card"> | number
    marketCap?: FloatNullableWithAggregatesFilter<"Card"> | number | null
    volume24h?: FloatWithAggregatesFilter<"Card"> | number
    priceChange24h?: FloatWithAggregatesFilter<"Card"> | number
    attributes?: JsonWithAggregatesFilter<"Card">
    metadata?: JsonWithAggregatesFilter<"Card">
    ownerId?: StringNullableWithAggregatesFilter<"Card"> | string | null
    isListed?: BoolWithAggregatesFilter<"Card"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Card"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Card"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: StringFilter<"Transaction"> | string
    fromUserId?: StringNullableFilter<"Transaction"> | string | null
    toUserId?: StringNullableFilter<"Transaction"> | string | null
    cardId?: StringNullableFilter<"Transaction"> | string | null
    amount?: FloatFilter<"Transaction"> | number
    currency?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    status?: StringFilter<"Transaction"> | string
    reference?: StringNullableFilter<"Transaction"> | string | null
    metadata?: JsonFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    fromUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    toUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    card?: XOR<CardNullableScalarRelationFilter, CardWhereInput> | null
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    fromUserId?: SortOrderInput | SortOrder
    toUserId?: SortOrderInput | SortOrder
    cardId?: SortOrderInput | SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reference?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    fromUser?: UserOrderByWithRelationInput
    toUser?: UserOrderByWithRelationInput
    card?: CardOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    fromUserId?: StringNullableFilter<"Transaction"> | string | null
    toUserId?: StringNullableFilter<"Transaction"> | string | null
    cardId?: StringNullableFilter<"Transaction"> | string | null
    amount?: FloatFilter<"Transaction"> | number
    currency?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    status?: StringFilter<"Transaction"> | string
    reference?: StringNullableFilter<"Transaction"> | string | null
    metadata?: JsonFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
    fromUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    toUser?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    card?: XOR<CardNullableScalarRelationFilter, CardWhereInput> | null
  }, "id">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    fromUserId?: SortOrderInput | SortOrder
    toUserId?: SortOrderInput | SortOrder
    cardId?: SortOrderInput | SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reference?: SortOrderInput | SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transaction"> | string
    fromUserId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    toUserId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    cardId?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    amount?: FloatWithAggregatesFilter<"Transaction"> | number
    currency?: StringWithAggregatesFilter<"Transaction"> | string
    type?: StringWithAggregatesFilter<"Transaction"> | string
    status?: StringWithAggregatesFilter<"Transaction"> | string
    reference?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    metadata?: JsonWithAggregatesFilter<"Transaction">
    createdAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type TradeOfferWhereInput = {
    AND?: TradeOfferWhereInput | TradeOfferWhereInput[]
    OR?: TradeOfferWhereInput[]
    NOT?: TradeOfferWhereInput | TradeOfferWhereInput[]
    id?: StringFilter<"TradeOffer"> | string
    senderId?: StringFilter<"TradeOffer"> | string
    receiverId?: StringFilter<"TradeOffer"> | string
    status?: EnumTradeOfferStatusFilter<"TradeOffer"> | $Enums.TradeOfferStatus
    message?: StringNullableFilter<"TradeOffer"> | string | null
    expiresAt?: DateTimeNullableFilter<"TradeOffer"> | Date | string | null
    createdAt?: DateTimeFilter<"TradeOffer"> | Date | string
    updatedAt?: DateTimeFilter<"TradeOffer"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: TradeOfferItemListRelationFilter
  }

  export type TradeOfferOrderByWithRelationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sender?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
    items?: TradeOfferItemOrderByRelationAggregateInput
  }

  export type TradeOfferWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradeOfferWhereInput | TradeOfferWhereInput[]
    OR?: TradeOfferWhereInput[]
    NOT?: TradeOfferWhereInput | TradeOfferWhereInput[]
    senderId?: StringFilter<"TradeOffer"> | string
    receiverId?: StringFilter<"TradeOffer"> | string
    status?: EnumTradeOfferStatusFilter<"TradeOffer"> | $Enums.TradeOfferStatus
    message?: StringNullableFilter<"TradeOffer"> | string | null
    expiresAt?: DateTimeNullableFilter<"TradeOffer"> | Date | string | null
    createdAt?: DateTimeFilter<"TradeOffer"> | Date | string
    updatedAt?: DateTimeFilter<"TradeOffer"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: TradeOfferItemListRelationFilter
  }, "id">

  export type TradeOfferOrderByWithAggregationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    message?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TradeOfferCountOrderByAggregateInput
    _max?: TradeOfferMaxOrderByAggregateInput
    _min?: TradeOfferMinOrderByAggregateInput
  }

  export type TradeOfferScalarWhereWithAggregatesInput = {
    AND?: TradeOfferScalarWhereWithAggregatesInput | TradeOfferScalarWhereWithAggregatesInput[]
    OR?: TradeOfferScalarWhereWithAggregatesInput[]
    NOT?: TradeOfferScalarWhereWithAggregatesInput | TradeOfferScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradeOffer"> | string
    senderId?: StringWithAggregatesFilter<"TradeOffer"> | string
    receiverId?: StringWithAggregatesFilter<"TradeOffer"> | string
    status?: EnumTradeOfferStatusWithAggregatesFilter<"TradeOffer"> | $Enums.TradeOfferStatus
    message?: StringNullableWithAggregatesFilter<"TradeOffer"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"TradeOffer"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TradeOffer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TradeOffer"> | Date | string
  }

  export type TradeOfferItemWhereInput = {
    AND?: TradeOfferItemWhereInput | TradeOfferItemWhereInput[]
    OR?: TradeOfferItemWhereInput[]
    NOT?: TradeOfferItemWhereInput | TradeOfferItemWhereInput[]
    id?: StringFilter<"TradeOfferItem"> | string
    tradeOfferId?: StringFilter<"TradeOfferItem"> | string
    cardId?: StringFilter<"TradeOfferItem"> | string
    role?: EnumTradeOfferItemRoleFilter<"TradeOfferItem"> | $Enums.TradeOfferItemRole
    quantity?: IntFilter<"TradeOfferItem"> | number
    createdAt?: DateTimeFilter<"TradeOfferItem"> | Date | string
    tradeOffer?: XOR<TradeOfferScalarRelationFilter, TradeOfferWhereInput>
    card?: XOR<CardScalarRelationFilter, CardWhereInput>
  }

  export type TradeOfferItemOrderByWithRelationInput = {
    id?: SortOrder
    tradeOfferId?: SortOrder
    cardId?: SortOrder
    role?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    tradeOffer?: TradeOfferOrderByWithRelationInput
    card?: CardOrderByWithRelationInput
  }

  export type TradeOfferItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradeOfferItemWhereInput | TradeOfferItemWhereInput[]
    OR?: TradeOfferItemWhereInput[]
    NOT?: TradeOfferItemWhereInput | TradeOfferItemWhereInput[]
    tradeOfferId?: StringFilter<"TradeOfferItem"> | string
    cardId?: StringFilter<"TradeOfferItem"> | string
    role?: EnumTradeOfferItemRoleFilter<"TradeOfferItem"> | $Enums.TradeOfferItemRole
    quantity?: IntFilter<"TradeOfferItem"> | number
    createdAt?: DateTimeFilter<"TradeOfferItem"> | Date | string
    tradeOffer?: XOR<TradeOfferScalarRelationFilter, TradeOfferWhereInput>
    card?: XOR<CardScalarRelationFilter, CardWhereInput>
  }, "id">

  export type TradeOfferItemOrderByWithAggregationInput = {
    id?: SortOrder
    tradeOfferId?: SortOrder
    cardId?: SortOrder
    role?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
    _count?: TradeOfferItemCountOrderByAggregateInput
    _avg?: TradeOfferItemAvgOrderByAggregateInput
    _max?: TradeOfferItemMaxOrderByAggregateInput
    _min?: TradeOfferItemMinOrderByAggregateInput
    _sum?: TradeOfferItemSumOrderByAggregateInput
  }

  export type TradeOfferItemScalarWhereWithAggregatesInput = {
    AND?: TradeOfferItemScalarWhereWithAggregatesInput | TradeOfferItemScalarWhereWithAggregatesInput[]
    OR?: TradeOfferItemScalarWhereWithAggregatesInput[]
    NOT?: TradeOfferItemScalarWhereWithAggregatesInput | TradeOfferItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradeOfferItem"> | string
    tradeOfferId?: StringWithAggregatesFilter<"TradeOfferItem"> | string
    cardId?: StringWithAggregatesFilter<"TradeOfferItem"> | string
    role?: EnumTradeOfferItemRoleWithAggregatesFilter<"TradeOfferItem"> | $Enums.TradeOfferItemRole
    quantity?: IntWithAggregatesFilter<"TradeOfferItem"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TradeOfferItem"> | Date | string
  }

  export type AppOrderWhereInput = {
    AND?: AppOrderWhereInput | AppOrderWhereInput[]
    OR?: AppOrderWhereInput[]
    NOT?: AppOrderWhereInput | AppOrderWhereInput[]
    id?: StringFilter<"AppOrder"> | string
    userId?: StringFilter<"AppOrder"> | string
    projectType?: StringFilter<"AppOrder"> | string
    title?: StringFilter<"AppOrder"> | string
    description?: StringFilter<"AppOrder"> | string
    requirements?: JsonFilter<"AppOrder">
    timeline?: StringFilter<"AppOrder"> | string
    estimatedCost?: FloatFilter<"AppOrder"> | number
    currency?: StringFilter<"AppOrder"> | string
    status?: StringFilter<"AppOrder"> | string
    priority?: StringFilter<"AppOrder"> | string
    progressPercentage?: IntFilter<"AppOrder"> | number
    completedAt?: DateTimeNullableFilter<"AppOrder"> | Date | string | null
    createdAt?: DateTimeFilter<"AppOrder"> | Date | string
    updatedAt?: DateTimeFilter<"AppOrder"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    revisions?: OrderRevisionListRelationFilter
    communications?: OrderCommunicationListRelationFilter
  }

  export type AppOrderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    timeline?: SortOrder
    estimatedCost?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    revisions?: OrderRevisionOrderByRelationAggregateInput
    communications?: OrderCommunicationOrderByRelationAggregateInput
  }

  export type AppOrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AppOrderWhereInput | AppOrderWhereInput[]
    OR?: AppOrderWhereInput[]
    NOT?: AppOrderWhereInput | AppOrderWhereInput[]
    userId?: StringFilter<"AppOrder"> | string
    projectType?: StringFilter<"AppOrder"> | string
    title?: StringFilter<"AppOrder"> | string
    description?: StringFilter<"AppOrder"> | string
    requirements?: JsonFilter<"AppOrder">
    timeline?: StringFilter<"AppOrder"> | string
    estimatedCost?: FloatFilter<"AppOrder"> | number
    currency?: StringFilter<"AppOrder"> | string
    status?: StringFilter<"AppOrder"> | string
    priority?: StringFilter<"AppOrder"> | string
    progressPercentage?: IntFilter<"AppOrder"> | number
    completedAt?: DateTimeNullableFilter<"AppOrder"> | Date | string | null
    createdAt?: DateTimeFilter<"AppOrder"> | Date | string
    updatedAt?: DateTimeFilter<"AppOrder"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    revisions?: OrderRevisionListRelationFilter
    communications?: OrderCommunicationListRelationFilter
  }, "id">

  export type AppOrderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    timeline?: SortOrder
    estimatedCost?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AppOrderCountOrderByAggregateInput
    _avg?: AppOrderAvgOrderByAggregateInput
    _max?: AppOrderMaxOrderByAggregateInput
    _min?: AppOrderMinOrderByAggregateInput
    _sum?: AppOrderSumOrderByAggregateInput
  }

  export type AppOrderScalarWhereWithAggregatesInput = {
    AND?: AppOrderScalarWhereWithAggregatesInput | AppOrderScalarWhereWithAggregatesInput[]
    OR?: AppOrderScalarWhereWithAggregatesInput[]
    NOT?: AppOrderScalarWhereWithAggregatesInput | AppOrderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AppOrder"> | string
    userId?: StringWithAggregatesFilter<"AppOrder"> | string
    projectType?: StringWithAggregatesFilter<"AppOrder"> | string
    title?: StringWithAggregatesFilter<"AppOrder"> | string
    description?: StringWithAggregatesFilter<"AppOrder"> | string
    requirements?: JsonWithAggregatesFilter<"AppOrder">
    timeline?: StringWithAggregatesFilter<"AppOrder"> | string
    estimatedCost?: FloatWithAggregatesFilter<"AppOrder"> | number
    currency?: StringWithAggregatesFilter<"AppOrder"> | string
    status?: StringWithAggregatesFilter<"AppOrder"> | string
    priority?: StringWithAggregatesFilter<"AppOrder"> | string
    progressPercentage?: IntWithAggregatesFilter<"AppOrder"> | number
    completedAt?: DateTimeNullableWithAggregatesFilter<"AppOrder"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AppOrder"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AppOrder"> | Date | string
  }

  export type OrderRevisionWhereInput = {
    AND?: OrderRevisionWhereInput | OrderRevisionWhereInput[]
    OR?: OrderRevisionWhereInput[]
    NOT?: OrderRevisionWhereInput | OrderRevisionWhereInput[]
    id?: StringFilter<"OrderRevision"> | string
    orderId?: StringFilter<"OrderRevision"> | string
    userId?: StringFilter<"OrderRevision"> | string
    revisionNumber?: IntFilter<"OrderRevision"> | number
    title?: StringFilter<"OrderRevision"> | string
    description?: StringFilter<"OrderRevision"> | string
    status?: StringFilter<"OrderRevision"> | string
    approvedAt?: DateTimeNullableFilter<"OrderRevision"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"OrderRevision"> | Date | string | null
    createdAt?: DateTimeFilter<"OrderRevision"> | Date | string
    updatedAt?: DateTimeFilter<"OrderRevision"> | Date | string
    order?: XOR<AppOrderScalarRelationFilter, AppOrderWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OrderRevisionOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    revisionNumber?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: AppOrderOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type OrderRevisionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderRevisionWhereInput | OrderRevisionWhereInput[]
    OR?: OrderRevisionWhereInput[]
    NOT?: OrderRevisionWhereInput | OrderRevisionWhereInput[]
    orderId?: StringFilter<"OrderRevision"> | string
    userId?: StringFilter<"OrderRevision"> | string
    revisionNumber?: IntFilter<"OrderRevision"> | number
    title?: StringFilter<"OrderRevision"> | string
    description?: StringFilter<"OrderRevision"> | string
    status?: StringFilter<"OrderRevision"> | string
    approvedAt?: DateTimeNullableFilter<"OrderRevision"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"OrderRevision"> | Date | string | null
    createdAt?: DateTimeFilter<"OrderRevision"> | Date | string
    updatedAt?: DateTimeFilter<"OrderRevision"> | Date | string
    order?: XOR<AppOrderScalarRelationFilter, AppOrderWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type OrderRevisionOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    revisionNumber?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    approvedAt?: SortOrderInput | SortOrder
    rejectedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderRevisionCountOrderByAggregateInput
    _avg?: OrderRevisionAvgOrderByAggregateInput
    _max?: OrderRevisionMaxOrderByAggregateInput
    _min?: OrderRevisionMinOrderByAggregateInput
    _sum?: OrderRevisionSumOrderByAggregateInput
  }

  export type OrderRevisionScalarWhereWithAggregatesInput = {
    AND?: OrderRevisionScalarWhereWithAggregatesInput | OrderRevisionScalarWhereWithAggregatesInput[]
    OR?: OrderRevisionScalarWhereWithAggregatesInput[]
    NOT?: OrderRevisionScalarWhereWithAggregatesInput | OrderRevisionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderRevision"> | string
    orderId?: StringWithAggregatesFilter<"OrderRevision"> | string
    userId?: StringWithAggregatesFilter<"OrderRevision"> | string
    revisionNumber?: IntWithAggregatesFilter<"OrderRevision"> | number
    title?: StringWithAggregatesFilter<"OrderRevision"> | string
    description?: StringWithAggregatesFilter<"OrderRevision"> | string
    status?: StringWithAggregatesFilter<"OrderRevision"> | string
    approvedAt?: DateTimeNullableWithAggregatesFilter<"OrderRevision"> | Date | string | null
    rejectedAt?: DateTimeNullableWithAggregatesFilter<"OrderRevision"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OrderRevision"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrderRevision"> | Date | string
  }

  export type OrderCommunicationWhereInput = {
    AND?: OrderCommunicationWhereInput | OrderCommunicationWhereInput[]
    OR?: OrderCommunicationWhereInput[]
    NOT?: OrderCommunicationWhereInput | OrderCommunicationWhereInput[]
    id?: StringFilter<"OrderCommunication"> | string
    orderId?: StringFilter<"OrderCommunication"> | string
    userId?: StringFilter<"OrderCommunication"> | string
    messageType?: StringFilter<"OrderCommunication"> | string
    subject?: StringFilter<"OrderCommunication"> | string
    message?: StringFilter<"OrderCommunication"> | string
    isFromAdmin?: BoolFilter<"OrderCommunication"> | boolean
    read?: BoolFilter<"OrderCommunication"> | boolean
    important?: BoolFilter<"OrderCommunication"> | boolean
    createdAt?: DateTimeFilter<"OrderCommunication"> | Date | string
    updatedAt?: DateTimeFilter<"OrderCommunication"> | Date | string
    order?: XOR<AppOrderScalarRelationFilter, AppOrderWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type OrderCommunicationOrderByWithRelationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    messageType?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    isFromAdmin?: SortOrder
    read?: SortOrder
    important?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    order?: AppOrderOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type OrderCommunicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrderCommunicationWhereInput | OrderCommunicationWhereInput[]
    OR?: OrderCommunicationWhereInput[]
    NOT?: OrderCommunicationWhereInput | OrderCommunicationWhereInput[]
    orderId?: StringFilter<"OrderCommunication"> | string
    userId?: StringFilter<"OrderCommunication"> | string
    messageType?: StringFilter<"OrderCommunication"> | string
    subject?: StringFilter<"OrderCommunication"> | string
    message?: StringFilter<"OrderCommunication"> | string
    isFromAdmin?: BoolFilter<"OrderCommunication"> | boolean
    read?: BoolFilter<"OrderCommunication"> | boolean
    important?: BoolFilter<"OrderCommunication"> | boolean
    createdAt?: DateTimeFilter<"OrderCommunication"> | Date | string
    updatedAt?: DateTimeFilter<"OrderCommunication"> | Date | string
    order?: XOR<AppOrderScalarRelationFilter, AppOrderWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type OrderCommunicationOrderByWithAggregationInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    messageType?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    isFromAdmin?: SortOrder
    read?: SortOrder
    important?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrderCommunicationCountOrderByAggregateInput
    _max?: OrderCommunicationMaxOrderByAggregateInput
    _min?: OrderCommunicationMinOrderByAggregateInput
  }

  export type OrderCommunicationScalarWhereWithAggregatesInput = {
    AND?: OrderCommunicationScalarWhereWithAggregatesInput | OrderCommunicationScalarWhereWithAggregatesInput[]
    OR?: OrderCommunicationScalarWhereWithAggregatesInput[]
    NOT?: OrderCommunicationScalarWhereWithAggregatesInput | OrderCommunicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"OrderCommunication"> | string
    orderId?: StringWithAggregatesFilter<"OrderCommunication"> | string
    userId?: StringWithAggregatesFilter<"OrderCommunication"> | string
    messageType?: StringWithAggregatesFilter<"OrderCommunication"> | string
    subject?: StringWithAggregatesFilter<"OrderCommunication"> | string
    message?: StringWithAggregatesFilter<"OrderCommunication"> | string
    isFromAdmin?: BoolWithAggregatesFilter<"OrderCommunication"> | boolean
    read?: BoolWithAggregatesFilter<"OrderCommunication"> | boolean
    important?: BoolWithAggregatesFilter<"OrderCommunication"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"OrderCommunication"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OrderCommunication"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardCreateInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutCardsInput
    transactions?: TransactionCreateNestedManyWithoutCardInput
    tradeOfferItems?: TradeOfferItemCreateNestedManyWithoutCardInput
  }

  export type CardUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: string | null
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutCardInput
    tradeOfferItems?: TradeOfferItemUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutCardsNestedInput
    transactions?: TransactionUpdateManyWithoutCardNestedInput
    tradeOfferItems?: TradeOfferItemUpdateManyWithoutCardNestedInput
  }

  export type CardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutCardNestedInput
    tradeOfferItems?: TradeOfferItemUncheckedUpdateManyWithoutCardNestedInput
  }

  export type CardCreateManyInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: string | null
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    id?: string
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromUser?: UserCreateNestedOneWithoutTransactionsFromInput
    toUser?: UserCreateNestedOneWithoutTransactionsToInput
    card?: CardCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    fromUserId?: string | null
    toUserId?: string | null
    cardId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromUser?: UserUpdateOneWithoutTransactionsFromNestedInput
    toUser?: UserUpdateOneWithoutTransactionsToNestedInput
    card?: CardUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    toUserId?: NullableStringFieldUpdateOperationsInput | string | null
    cardId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: string
    fromUserId?: string | null
    toUserId?: string | null
    cardId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    toUserId?: NullableStringFieldUpdateOperationsInput | string | null
    cardId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferCreateInput = {
    id?: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutTradeOffersSentInput
    receiver: UserCreateNestedOneWithoutTradeOffersReceivedInput
    items?: TradeOfferItemCreateNestedManyWithoutTradeOfferInput
  }

  export type TradeOfferUncheckedCreateInput = {
    id?: string
    senderId: string
    receiverId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TradeOfferItemUncheckedCreateNestedManyWithoutTradeOfferInput
  }

  export type TradeOfferUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutTradeOffersSentNestedInput
    receiver?: UserUpdateOneRequiredWithoutTradeOffersReceivedNestedInput
    items?: TradeOfferItemUpdateManyWithoutTradeOfferNestedInput
  }

  export type TradeOfferUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TradeOfferItemUncheckedUpdateManyWithoutTradeOfferNestedInput
  }

  export type TradeOfferCreateManyInput = {
    id?: string
    senderId: string
    receiverId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeOfferUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemCreateInput = {
    id?: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
    tradeOffer: TradeOfferCreateNestedOneWithoutItemsInput
    card: CardCreateNestedOneWithoutTradeOfferItemsInput
  }

  export type TradeOfferItemUncheckedCreateInput = {
    id?: string
    tradeOfferId: string
    cardId: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
  }

  export type TradeOfferItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeOffer?: TradeOfferUpdateOneRequiredWithoutItemsNestedInput
    card?: CardUpdateOneRequiredWithoutTradeOfferItemsNestedInput
  }

  export type TradeOfferItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeOfferId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemCreateManyInput = {
    id?: string
    tradeOfferId: string
    cardId: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
  }

  export type TradeOfferItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeOfferId?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppOrderCreateInput = {
    id?: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAppOrdersInput
    revisions?: OrderRevisionCreateNestedManyWithoutOrderInput
    communications?: OrderCommunicationCreateNestedManyWithoutOrderInput
  }

  export type AppOrderUncheckedCreateInput = {
    id?: string
    userId: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    revisions?: OrderRevisionUncheckedCreateNestedManyWithoutOrderInput
    communications?: OrderCommunicationUncheckedCreateNestedManyWithoutOrderInput
  }

  export type AppOrderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAppOrdersNestedInput
    revisions?: OrderRevisionUpdateManyWithoutOrderNestedInput
    communications?: OrderCommunicationUpdateManyWithoutOrderNestedInput
  }

  export type AppOrderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revisions?: OrderRevisionUncheckedUpdateManyWithoutOrderNestedInput
    communications?: OrderCommunicationUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type AppOrderCreateManyInput = {
    id?: string
    userId: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppOrderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppOrderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionCreateInput = {
    id?: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    order: AppOrderCreateNestedOneWithoutRevisionsInput
    user: UserCreateNestedOneWithoutOrderRevisionsInput
  }

  export type OrderRevisionUncheckedCreateInput = {
    id?: string
    orderId: string
    userId: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderRevisionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: AppOrderUpdateOneRequiredWithoutRevisionsNestedInput
    user?: UserUpdateOneRequiredWithoutOrderRevisionsNestedInput
  }

  export type OrderRevisionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionCreateManyInput = {
    id?: string
    orderId: string
    userId: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderRevisionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationCreateInput = {
    id?: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    order: AppOrderCreateNestedOneWithoutCommunicationsInput
    user: UserCreateNestedOneWithoutOrderCommunicationsInput
  }

  export type OrderCommunicationUncheckedCreateInput = {
    id?: string
    orderId: string
    userId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCommunicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: AppOrderUpdateOneRequiredWithoutCommunicationsNestedInput
    user?: UserUpdateOneRequiredWithoutOrderCommunicationsNestedInput
  }

  export type OrderCommunicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationCreateManyInput = {
    id?: string
    orderId: string
    userId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCommunicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type CardListRelationFilter = {
    every?: CardWhereInput
    some?: CardWhereInput
    none?: CardWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type TradeOfferListRelationFilter = {
    every?: TradeOfferWhereInput
    some?: TradeOfferWhereInput
    none?: TradeOfferWhereInput
  }

  export type AppOrderListRelationFilter = {
    every?: AppOrderWhereInput
    some?: AppOrderWhereInput
    none?: AppOrderWhereInput
  }

  export type OrderRevisionListRelationFilter = {
    every?: OrderRevisionWhereInput
    some?: OrderRevisionWhereInput
    none?: OrderRevisionWhereInput
  }

  export type OrderCommunicationListRelationFilter = {
    every?: OrderCommunicationWhereInput
    some?: OrderCommunicationWhereInput
    none?: OrderCommunicationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradeOfferOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AppOrderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderRevisionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrderCommunicationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    eceBalance?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    eceBalance?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    eceBalance?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    eceBalance?: SortOrder
    refreshToken?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    eceBalance?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TradeOfferItemListRelationFilter = {
    every?: TradeOfferItemWhereInput
    some?: TradeOfferItemWhereInput
    none?: TradeOfferItemWhereInput
  }

  export type TradeOfferItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CardCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    rarity?: SortOrder
    category?: SortOrder
    company?: SortOrder
    valuation?: SortOrder
    marketCap?: SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
    attributes?: SortOrder
    metadata?: SortOrder
    ownerId?: SortOrder
    isListed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardAvgOrderByAggregateInput = {
    valuation?: SortOrder
    marketCap?: SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
  }

  export type CardMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    rarity?: SortOrder
    category?: SortOrder
    company?: SortOrder
    valuation?: SortOrder
    marketCap?: SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
    ownerId?: SortOrder
    isListed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    imageUrl?: SortOrder
    rarity?: SortOrder
    category?: SortOrder
    company?: SortOrder
    valuation?: SortOrder
    marketCap?: SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
    ownerId?: SortOrder
    isListed?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardSumOrderByAggregateInput = {
    valuation?: SortOrder
    marketCap?: SortOrder
    volume24h?: SortOrder
    priceChange24h?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CardNullableScalarRelationFilter = {
    is?: CardWhereInput | null
    isNot?: CardWhereInput | null
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    cardId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reference?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    cardId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    fromUserId?: SortOrder
    toUserId?: SortOrder
    cardId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    type?: SortOrder
    status?: SortOrder
    reference?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumTradeOfferStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferStatus | EnumTradeOfferStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferStatusFilter<$PrismaModel> | $Enums.TradeOfferStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TradeOfferCountOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    message?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeOfferMaxOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    message?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TradeOfferMinOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    message?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTradeOfferStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferStatus | EnumTradeOfferStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferStatusWithAggregatesFilter<$PrismaModel> | $Enums.TradeOfferStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeOfferStatusFilter<$PrismaModel>
    _max?: NestedEnumTradeOfferStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumTradeOfferItemRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferItemRole | EnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferItemRoleFilter<$PrismaModel> | $Enums.TradeOfferItemRole
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type TradeOfferScalarRelationFilter = {
    is?: TradeOfferWhereInput
    isNot?: TradeOfferWhereInput
  }

  export type CardScalarRelationFilter = {
    is?: CardWhereInput
    isNot?: CardWhereInput
  }

  export type TradeOfferItemCountOrderByAggregateInput = {
    id?: SortOrder
    tradeOfferId?: SortOrder
    cardId?: SortOrder
    role?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeOfferItemAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type TradeOfferItemMaxOrderByAggregateInput = {
    id?: SortOrder
    tradeOfferId?: SortOrder
    cardId?: SortOrder
    role?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeOfferItemMinOrderByAggregateInput = {
    id?: SortOrder
    tradeOfferId?: SortOrder
    cardId?: SortOrder
    role?: SortOrder
    quantity?: SortOrder
    createdAt?: SortOrder
  }

  export type TradeOfferItemSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumTradeOfferItemRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferItemRole | EnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferItemRoleWithAggregatesFilter<$PrismaModel> | $Enums.TradeOfferItemRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeOfferItemRoleFilter<$PrismaModel>
    _max?: NestedEnumTradeOfferItemRoleFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type AppOrderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    requirements?: SortOrder
    timeline?: SortOrder
    estimatedCost?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppOrderAvgOrderByAggregateInput = {
    estimatedCost?: SortOrder
    progressPercentage?: SortOrder
  }

  export type AppOrderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    timeline?: SortOrder
    estimatedCost?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppOrderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectType?: SortOrder
    title?: SortOrder
    description?: SortOrder
    timeline?: SortOrder
    estimatedCost?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    progressPercentage?: SortOrder
    completedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AppOrderSumOrderByAggregateInput = {
    estimatedCost?: SortOrder
    progressPercentage?: SortOrder
  }

  export type AppOrderScalarRelationFilter = {
    is?: AppOrderWhereInput
    isNot?: AppOrderWhereInput
  }

  export type OrderRevisionCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    revisionNumber?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    approvedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderRevisionAvgOrderByAggregateInput = {
    revisionNumber?: SortOrder
  }

  export type OrderRevisionMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    revisionNumber?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    approvedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderRevisionMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    revisionNumber?: SortOrder
    title?: SortOrder
    description?: SortOrder
    status?: SortOrder
    approvedAt?: SortOrder
    rejectedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderRevisionSumOrderByAggregateInput = {
    revisionNumber?: SortOrder
  }

  export type OrderCommunicationCountOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    messageType?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    isFromAdmin?: SortOrder
    read?: SortOrder
    important?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderCommunicationMaxOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    messageType?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    isFromAdmin?: SortOrder
    read?: SortOrder
    important?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrderCommunicationMinOrderByAggregateInput = {
    id?: SortOrder
    orderId?: SortOrder
    userId?: SortOrder
    messageType?: SortOrder
    subject?: SortOrder
    message?: SortOrder
    isFromAdmin?: SortOrder
    read?: SortOrder
    important?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CardCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CardCreateWithoutOwnerInput, CardUncheckedCreateWithoutOwnerInput> | CardCreateWithoutOwnerInput[] | CardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CardCreateOrConnectWithoutOwnerInput | CardCreateOrConnectWithoutOwnerInput[]
    createMany?: CardCreateManyOwnerInputEnvelope
    connect?: CardWhereUniqueInput | CardWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutFromUserInput = {
    create?: XOR<TransactionCreateWithoutFromUserInput, TransactionUncheckedCreateWithoutFromUserInput> | TransactionCreateWithoutFromUserInput[] | TransactionUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutFromUserInput | TransactionCreateOrConnectWithoutFromUserInput[]
    createMany?: TransactionCreateManyFromUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutToUserInput = {
    create?: XOR<TransactionCreateWithoutToUserInput, TransactionUncheckedCreateWithoutToUserInput> | TransactionCreateWithoutToUserInput[] | TransactionUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutToUserInput | TransactionCreateOrConnectWithoutToUserInput[]
    createMany?: TransactionCreateManyToUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TradeOfferCreateNestedManyWithoutSenderInput = {
    create?: XOR<TradeOfferCreateWithoutSenderInput, TradeOfferUncheckedCreateWithoutSenderInput> | TradeOfferCreateWithoutSenderInput[] | TradeOfferUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutSenderInput | TradeOfferCreateOrConnectWithoutSenderInput[]
    createMany?: TradeOfferCreateManySenderInputEnvelope
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
  }

  export type TradeOfferCreateNestedManyWithoutReceiverInput = {
    create?: XOR<TradeOfferCreateWithoutReceiverInput, TradeOfferUncheckedCreateWithoutReceiverInput> | TradeOfferCreateWithoutReceiverInput[] | TradeOfferUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutReceiverInput | TradeOfferCreateOrConnectWithoutReceiverInput[]
    createMany?: TradeOfferCreateManyReceiverInputEnvelope
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
  }

  export type AppOrderCreateNestedManyWithoutUserInput = {
    create?: XOR<AppOrderCreateWithoutUserInput, AppOrderUncheckedCreateWithoutUserInput> | AppOrderCreateWithoutUserInput[] | AppOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppOrderCreateOrConnectWithoutUserInput | AppOrderCreateOrConnectWithoutUserInput[]
    createMany?: AppOrderCreateManyUserInputEnvelope
    connect?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
  }

  export type OrderRevisionCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderRevisionCreateWithoutUserInput, OrderRevisionUncheckedCreateWithoutUserInput> | OrderRevisionCreateWithoutUserInput[] | OrderRevisionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutUserInput | OrderRevisionCreateOrConnectWithoutUserInput[]
    createMany?: OrderRevisionCreateManyUserInputEnvelope
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
  }

  export type OrderCommunicationCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCommunicationCreateWithoutUserInput, OrderCommunicationUncheckedCreateWithoutUserInput> | OrderCommunicationCreateWithoutUserInput[] | OrderCommunicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutUserInput | OrderCommunicationCreateOrConnectWithoutUserInput[]
    createMany?: OrderCommunicationCreateManyUserInputEnvelope
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
  }

  export type CardUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<CardCreateWithoutOwnerInput, CardUncheckedCreateWithoutOwnerInput> | CardCreateWithoutOwnerInput[] | CardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CardCreateOrConnectWithoutOwnerInput | CardCreateOrConnectWithoutOwnerInput[]
    createMany?: CardCreateManyOwnerInputEnvelope
    connect?: CardWhereUniqueInput | CardWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutFromUserInput = {
    create?: XOR<TransactionCreateWithoutFromUserInput, TransactionUncheckedCreateWithoutFromUserInput> | TransactionCreateWithoutFromUserInput[] | TransactionUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutFromUserInput | TransactionCreateOrConnectWithoutFromUserInput[]
    createMany?: TransactionCreateManyFromUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutToUserInput = {
    create?: XOR<TransactionCreateWithoutToUserInput, TransactionUncheckedCreateWithoutToUserInput> | TransactionCreateWithoutToUserInput[] | TransactionUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutToUserInput | TransactionCreateOrConnectWithoutToUserInput[]
    createMany?: TransactionCreateManyToUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TradeOfferUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<TradeOfferCreateWithoutSenderInput, TradeOfferUncheckedCreateWithoutSenderInput> | TradeOfferCreateWithoutSenderInput[] | TradeOfferUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutSenderInput | TradeOfferCreateOrConnectWithoutSenderInput[]
    createMany?: TradeOfferCreateManySenderInputEnvelope
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
  }

  export type TradeOfferUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<TradeOfferCreateWithoutReceiverInput, TradeOfferUncheckedCreateWithoutReceiverInput> | TradeOfferCreateWithoutReceiverInput[] | TradeOfferUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutReceiverInput | TradeOfferCreateOrConnectWithoutReceiverInput[]
    createMany?: TradeOfferCreateManyReceiverInputEnvelope
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
  }

  export type AppOrderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AppOrderCreateWithoutUserInput, AppOrderUncheckedCreateWithoutUserInput> | AppOrderCreateWithoutUserInput[] | AppOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppOrderCreateOrConnectWithoutUserInput | AppOrderCreateOrConnectWithoutUserInput[]
    createMany?: AppOrderCreateManyUserInputEnvelope
    connect?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
  }

  export type OrderRevisionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderRevisionCreateWithoutUserInput, OrderRevisionUncheckedCreateWithoutUserInput> | OrderRevisionCreateWithoutUserInput[] | OrderRevisionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutUserInput | OrderRevisionCreateOrConnectWithoutUserInput[]
    createMany?: OrderRevisionCreateManyUserInputEnvelope
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
  }

  export type OrderCommunicationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<OrderCommunicationCreateWithoutUserInput, OrderCommunicationUncheckedCreateWithoutUserInput> | OrderCommunicationCreateWithoutUserInput[] | OrderCommunicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutUserInput | OrderCommunicationCreateOrConnectWithoutUserInput[]
    createMany?: OrderCommunicationCreateManyUserInputEnvelope
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type CardUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CardCreateWithoutOwnerInput, CardUncheckedCreateWithoutOwnerInput> | CardCreateWithoutOwnerInput[] | CardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CardCreateOrConnectWithoutOwnerInput | CardCreateOrConnectWithoutOwnerInput[]
    upsert?: CardUpsertWithWhereUniqueWithoutOwnerInput | CardUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CardCreateManyOwnerInputEnvelope
    set?: CardWhereUniqueInput | CardWhereUniqueInput[]
    disconnect?: CardWhereUniqueInput | CardWhereUniqueInput[]
    delete?: CardWhereUniqueInput | CardWhereUniqueInput[]
    connect?: CardWhereUniqueInput | CardWhereUniqueInput[]
    update?: CardUpdateWithWhereUniqueWithoutOwnerInput | CardUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CardUpdateManyWithWhereWithoutOwnerInput | CardUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CardScalarWhereInput | CardScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutFromUserNestedInput = {
    create?: XOR<TransactionCreateWithoutFromUserInput, TransactionUncheckedCreateWithoutFromUserInput> | TransactionCreateWithoutFromUserInput[] | TransactionUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutFromUserInput | TransactionCreateOrConnectWithoutFromUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutFromUserInput | TransactionUpsertWithWhereUniqueWithoutFromUserInput[]
    createMany?: TransactionCreateManyFromUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutFromUserInput | TransactionUpdateWithWhereUniqueWithoutFromUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutFromUserInput | TransactionUpdateManyWithWhereWithoutFromUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutToUserNestedInput = {
    create?: XOR<TransactionCreateWithoutToUserInput, TransactionUncheckedCreateWithoutToUserInput> | TransactionCreateWithoutToUserInput[] | TransactionUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutToUserInput | TransactionCreateOrConnectWithoutToUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutToUserInput | TransactionUpsertWithWhereUniqueWithoutToUserInput[]
    createMany?: TransactionCreateManyToUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutToUserInput | TransactionUpdateWithWhereUniqueWithoutToUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutToUserInput | TransactionUpdateManyWithWhereWithoutToUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TradeOfferUpdateManyWithoutSenderNestedInput = {
    create?: XOR<TradeOfferCreateWithoutSenderInput, TradeOfferUncheckedCreateWithoutSenderInput> | TradeOfferCreateWithoutSenderInput[] | TradeOfferUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutSenderInput | TradeOfferCreateOrConnectWithoutSenderInput[]
    upsert?: TradeOfferUpsertWithWhereUniqueWithoutSenderInput | TradeOfferUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: TradeOfferCreateManySenderInputEnvelope
    set?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    disconnect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    delete?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    update?: TradeOfferUpdateWithWhereUniqueWithoutSenderInput | TradeOfferUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: TradeOfferUpdateManyWithWhereWithoutSenderInput | TradeOfferUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: TradeOfferScalarWhereInput | TradeOfferScalarWhereInput[]
  }

  export type TradeOfferUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<TradeOfferCreateWithoutReceiverInput, TradeOfferUncheckedCreateWithoutReceiverInput> | TradeOfferCreateWithoutReceiverInput[] | TradeOfferUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutReceiverInput | TradeOfferCreateOrConnectWithoutReceiverInput[]
    upsert?: TradeOfferUpsertWithWhereUniqueWithoutReceiverInput | TradeOfferUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: TradeOfferCreateManyReceiverInputEnvelope
    set?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    disconnect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    delete?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    update?: TradeOfferUpdateWithWhereUniqueWithoutReceiverInput | TradeOfferUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: TradeOfferUpdateManyWithWhereWithoutReceiverInput | TradeOfferUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: TradeOfferScalarWhereInput | TradeOfferScalarWhereInput[]
  }

  export type AppOrderUpdateManyWithoutUserNestedInput = {
    create?: XOR<AppOrderCreateWithoutUserInput, AppOrderUncheckedCreateWithoutUserInput> | AppOrderCreateWithoutUserInput[] | AppOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppOrderCreateOrConnectWithoutUserInput | AppOrderCreateOrConnectWithoutUserInput[]
    upsert?: AppOrderUpsertWithWhereUniqueWithoutUserInput | AppOrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AppOrderCreateManyUserInputEnvelope
    set?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    disconnect?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    delete?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    connect?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    update?: AppOrderUpdateWithWhereUniqueWithoutUserInput | AppOrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AppOrderUpdateManyWithWhereWithoutUserInput | AppOrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AppOrderScalarWhereInput | AppOrderScalarWhereInput[]
  }

  export type OrderRevisionUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderRevisionCreateWithoutUserInput, OrderRevisionUncheckedCreateWithoutUserInput> | OrderRevisionCreateWithoutUserInput[] | OrderRevisionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutUserInput | OrderRevisionCreateOrConnectWithoutUserInput[]
    upsert?: OrderRevisionUpsertWithWhereUniqueWithoutUserInput | OrderRevisionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderRevisionCreateManyUserInputEnvelope
    set?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    disconnect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    delete?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    update?: OrderRevisionUpdateWithWhereUniqueWithoutUserInput | OrderRevisionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderRevisionUpdateManyWithWhereWithoutUserInput | OrderRevisionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderRevisionScalarWhereInput | OrderRevisionScalarWhereInput[]
  }

  export type OrderCommunicationUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCommunicationCreateWithoutUserInput, OrderCommunicationUncheckedCreateWithoutUserInput> | OrderCommunicationCreateWithoutUserInput[] | OrderCommunicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutUserInput | OrderCommunicationCreateOrConnectWithoutUserInput[]
    upsert?: OrderCommunicationUpsertWithWhereUniqueWithoutUserInput | OrderCommunicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCommunicationCreateManyUserInputEnvelope
    set?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    disconnect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    delete?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    update?: OrderCommunicationUpdateWithWhereUniqueWithoutUserInput | OrderCommunicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderCommunicationUpdateManyWithWhereWithoutUserInput | OrderCommunicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderCommunicationScalarWhereInput | OrderCommunicationScalarWhereInput[]
  }

  export type CardUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<CardCreateWithoutOwnerInput, CardUncheckedCreateWithoutOwnerInput> | CardCreateWithoutOwnerInput[] | CardUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: CardCreateOrConnectWithoutOwnerInput | CardCreateOrConnectWithoutOwnerInput[]
    upsert?: CardUpsertWithWhereUniqueWithoutOwnerInput | CardUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: CardCreateManyOwnerInputEnvelope
    set?: CardWhereUniqueInput | CardWhereUniqueInput[]
    disconnect?: CardWhereUniqueInput | CardWhereUniqueInput[]
    delete?: CardWhereUniqueInput | CardWhereUniqueInput[]
    connect?: CardWhereUniqueInput | CardWhereUniqueInput[]
    update?: CardUpdateWithWhereUniqueWithoutOwnerInput | CardUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: CardUpdateManyWithWhereWithoutOwnerInput | CardUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: CardScalarWhereInput | CardScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutFromUserNestedInput = {
    create?: XOR<TransactionCreateWithoutFromUserInput, TransactionUncheckedCreateWithoutFromUserInput> | TransactionCreateWithoutFromUserInput[] | TransactionUncheckedCreateWithoutFromUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutFromUserInput | TransactionCreateOrConnectWithoutFromUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutFromUserInput | TransactionUpsertWithWhereUniqueWithoutFromUserInput[]
    createMany?: TransactionCreateManyFromUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutFromUserInput | TransactionUpdateWithWhereUniqueWithoutFromUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutFromUserInput | TransactionUpdateManyWithWhereWithoutFromUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutToUserNestedInput = {
    create?: XOR<TransactionCreateWithoutToUserInput, TransactionUncheckedCreateWithoutToUserInput> | TransactionCreateWithoutToUserInput[] | TransactionUncheckedCreateWithoutToUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutToUserInput | TransactionCreateOrConnectWithoutToUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutToUserInput | TransactionUpsertWithWhereUniqueWithoutToUserInput[]
    createMany?: TransactionCreateManyToUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutToUserInput | TransactionUpdateWithWhereUniqueWithoutToUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutToUserInput | TransactionUpdateManyWithWhereWithoutToUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TradeOfferUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<TradeOfferCreateWithoutSenderInput, TradeOfferUncheckedCreateWithoutSenderInput> | TradeOfferCreateWithoutSenderInput[] | TradeOfferUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutSenderInput | TradeOfferCreateOrConnectWithoutSenderInput[]
    upsert?: TradeOfferUpsertWithWhereUniqueWithoutSenderInput | TradeOfferUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: TradeOfferCreateManySenderInputEnvelope
    set?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    disconnect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    delete?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    update?: TradeOfferUpdateWithWhereUniqueWithoutSenderInput | TradeOfferUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: TradeOfferUpdateManyWithWhereWithoutSenderInput | TradeOfferUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: TradeOfferScalarWhereInput | TradeOfferScalarWhereInput[]
  }

  export type TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<TradeOfferCreateWithoutReceiverInput, TradeOfferUncheckedCreateWithoutReceiverInput> | TradeOfferCreateWithoutReceiverInput[] | TradeOfferUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: TradeOfferCreateOrConnectWithoutReceiverInput | TradeOfferCreateOrConnectWithoutReceiverInput[]
    upsert?: TradeOfferUpsertWithWhereUniqueWithoutReceiverInput | TradeOfferUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: TradeOfferCreateManyReceiverInputEnvelope
    set?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    disconnect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    delete?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    connect?: TradeOfferWhereUniqueInput | TradeOfferWhereUniqueInput[]
    update?: TradeOfferUpdateWithWhereUniqueWithoutReceiverInput | TradeOfferUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: TradeOfferUpdateManyWithWhereWithoutReceiverInput | TradeOfferUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: TradeOfferScalarWhereInput | TradeOfferScalarWhereInput[]
  }

  export type AppOrderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AppOrderCreateWithoutUserInput, AppOrderUncheckedCreateWithoutUserInput> | AppOrderCreateWithoutUserInput[] | AppOrderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AppOrderCreateOrConnectWithoutUserInput | AppOrderCreateOrConnectWithoutUserInput[]
    upsert?: AppOrderUpsertWithWhereUniqueWithoutUserInput | AppOrderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AppOrderCreateManyUserInputEnvelope
    set?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    disconnect?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    delete?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    connect?: AppOrderWhereUniqueInput | AppOrderWhereUniqueInput[]
    update?: AppOrderUpdateWithWhereUniqueWithoutUserInput | AppOrderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AppOrderUpdateManyWithWhereWithoutUserInput | AppOrderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AppOrderScalarWhereInput | AppOrderScalarWhereInput[]
  }

  export type OrderRevisionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderRevisionCreateWithoutUserInput, OrderRevisionUncheckedCreateWithoutUserInput> | OrderRevisionCreateWithoutUserInput[] | OrderRevisionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutUserInput | OrderRevisionCreateOrConnectWithoutUserInput[]
    upsert?: OrderRevisionUpsertWithWhereUniqueWithoutUserInput | OrderRevisionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderRevisionCreateManyUserInputEnvelope
    set?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    disconnect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    delete?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    update?: OrderRevisionUpdateWithWhereUniqueWithoutUserInput | OrderRevisionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderRevisionUpdateManyWithWhereWithoutUserInput | OrderRevisionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderRevisionScalarWhereInput | OrderRevisionScalarWhereInput[]
  }

  export type OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<OrderCommunicationCreateWithoutUserInput, OrderCommunicationUncheckedCreateWithoutUserInput> | OrderCommunicationCreateWithoutUserInput[] | OrderCommunicationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutUserInput | OrderCommunicationCreateOrConnectWithoutUserInput[]
    upsert?: OrderCommunicationUpsertWithWhereUniqueWithoutUserInput | OrderCommunicationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: OrderCommunicationCreateManyUserInputEnvelope
    set?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    disconnect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    delete?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    update?: OrderCommunicationUpdateWithWhereUniqueWithoutUserInput | OrderCommunicationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: OrderCommunicationUpdateManyWithWhereWithoutUserInput | OrderCommunicationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: OrderCommunicationScalarWhereInput | OrderCommunicationScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCardsInput = {
    create?: XOR<UserCreateWithoutCardsInput, UserUncheckedCreateWithoutCardsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCardsInput
    connect?: UserWhereUniqueInput
  }

  export type TransactionCreateNestedManyWithoutCardInput = {
    create?: XOR<TransactionCreateWithoutCardInput, TransactionUncheckedCreateWithoutCardInput> | TransactionCreateWithoutCardInput[] | TransactionUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCardInput | TransactionCreateOrConnectWithoutCardInput[]
    createMany?: TransactionCreateManyCardInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TradeOfferItemCreateNestedManyWithoutCardInput = {
    create?: XOR<TradeOfferItemCreateWithoutCardInput, TradeOfferItemUncheckedCreateWithoutCardInput> | TradeOfferItemCreateWithoutCardInput[] | TradeOfferItemUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutCardInput | TradeOfferItemCreateOrConnectWithoutCardInput[]
    createMany?: TradeOfferItemCreateManyCardInputEnvelope
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutCardInput = {
    create?: XOR<TransactionCreateWithoutCardInput, TransactionUncheckedCreateWithoutCardInput> | TransactionCreateWithoutCardInput[] | TransactionUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCardInput | TransactionCreateOrConnectWithoutCardInput[]
    createMany?: TransactionCreateManyCardInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TradeOfferItemUncheckedCreateNestedManyWithoutCardInput = {
    create?: XOR<TradeOfferItemCreateWithoutCardInput, TradeOfferItemUncheckedCreateWithoutCardInput> | TradeOfferItemCreateWithoutCardInput[] | TradeOfferItemUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutCardInput | TradeOfferItemCreateOrConnectWithoutCardInput[]
    createMany?: TradeOfferItemCreateManyCardInputEnvelope
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneWithoutCardsNestedInput = {
    create?: XOR<UserCreateWithoutCardsInput, UserUncheckedCreateWithoutCardsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCardsInput
    upsert?: UserUpsertWithoutCardsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCardsInput, UserUpdateWithoutCardsInput>, UserUncheckedUpdateWithoutCardsInput>
  }

  export type TransactionUpdateManyWithoutCardNestedInput = {
    create?: XOR<TransactionCreateWithoutCardInput, TransactionUncheckedCreateWithoutCardInput> | TransactionCreateWithoutCardInput[] | TransactionUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCardInput | TransactionCreateOrConnectWithoutCardInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCardInput | TransactionUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: TransactionCreateManyCardInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCardInput | TransactionUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCardInput | TransactionUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TradeOfferItemUpdateManyWithoutCardNestedInput = {
    create?: XOR<TradeOfferItemCreateWithoutCardInput, TradeOfferItemUncheckedCreateWithoutCardInput> | TradeOfferItemCreateWithoutCardInput[] | TradeOfferItemUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutCardInput | TradeOfferItemCreateOrConnectWithoutCardInput[]
    upsert?: TradeOfferItemUpsertWithWhereUniqueWithoutCardInput | TradeOfferItemUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: TradeOfferItemCreateManyCardInputEnvelope
    set?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    disconnect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    delete?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    update?: TradeOfferItemUpdateWithWhereUniqueWithoutCardInput | TradeOfferItemUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: TradeOfferItemUpdateManyWithWhereWithoutCardInput | TradeOfferItemUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: TradeOfferItemScalarWhereInput | TradeOfferItemScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutCardNestedInput = {
    create?: XOR<TransactionCreateWithoutCardInput, TransactionUncheckedCreateWithoutCardInput> | TransactionCreateWithoutCardInput[] | TransactionUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCardInput | TransactionCreateOrConnectWithoutCardInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCardInput | TransactionUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: TransactionCreateManyCardInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCardInput | TransactionUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCardInput | TransactionUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TradeOfferItemUncheckedUpdateManyWithoutCardNestedInput = {
    create?: XOR<TradeOfferItemCreateWithoutCardInput, TradeOfferItemUncheckedCreateWithoutCardInput> | TradeOfferItemCreateWithoutCardInput[] | TradeOfferItemUncheckedCreateWithoutCardInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutCardInput | TradeOfferItemCreateOrConnectWithoutCardInput[]
    upsert?: TradeOfferItemUpsertWithWhereUniqueWithoutCardInput | TradeOfferItemUpsertWithWhereUniqueWithoutCardInput[]
    createMany?: TradeOfferItemCreateManyCardInputEnvelope
    set?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    disconnect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    delete?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    update?: TradeOfferItemUpdateWithWhereUniqueWithoutCardInput | TradeOfferItemUpdateWithWhereUniqueWithoutCardInput[]
    updateMany?: TradeOfferItemUpdateManyWithWhereWithoutCardInput | TradeOfferItemUpdateManyWithWhereWithoutCardInput[]
    deleteMany?: TradeOfferItemScalarWhereInput | TradeOfferItemScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTransactionsFromInput = {
    create?: XOR<UserCreateWithoutTransactionsFromInput, UserUncheckedCreateWithoutTransactionsFromInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsFromInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransactionsToInput = {
    create?: XOR<UserCreateWithoutTransactionsToInput, UserUncheckedCreateWithoutTransactionsToInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsToInput
    connect?: UserWhereUniqueInput
  }

  export type CardCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<CardCreateWithoutTransactionsInput, CardUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: CardCreateOrConnectWithoutTransactionsInput
    connect?: CardWhereUniqueInput
  }

  export type UserUpdateOneWithoutTransactionsFromNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsFromInput, UserUncheckedCreateWithoutTransactionsFromInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsFromInput
    upsert?: UserUpsertWithoutTransactionsFromInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsFromInput, UserUpdateWithoutTransactionsFromInput>, UserUncheckedUpdateWithoutTransactionsFromInput>
  }

  export type UserUpdateOneWithoutTransactionsToNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsToInput, UserUncheckedCreateWithoutTransactionsToInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsToInput
    upsert?: UserUpsertWithoutTransactionsToInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsToInput, UserUpdateWithoutTransactionsToInput>, UserUncheckedUpdateWithoutTransactionsToInput>
  }

  export type CardUpdateOneWithoutTransactionsNestedInput = {
    create?: XOR<CardCreateWithoutTransactionsInput, CardUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: CardCreateOrConnectWithoutTransactionsInput
    upsert?: CardUpsertWithoutTransactionsInput
    disconnect?: CardWhereInput | boolean
    delete?: CardWhereInput | boolean
    connect?: CardWhereUniqueInput
    update?: XOR<XOR<CardUpdateToOneWithWhereWithoutTransactionsInput, CardUpdateWithoutTransactionsInput>, CardUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserCreateNestedOneWithoutTradeOffersSentInput = {
    create?: XOR<UserCreateWithoutTradeOffersSentInput, UserUncheckedCreateWithoutTradeOffersSentInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradeOffersSentInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTradeOffersReceivedInput = {
    create?: XOR<UserCreateWithoutTradeOffersReceivedInput, UserUncheckedCreateWithoutTradeOffersReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradeOffersReceivedInput
    connect?: UserWhereUniqueInput
  }

  export type TradeOfferItemCreateNestedManyWithoutTradeOfferInput = {
    create?: XOR<TradeOfferItemCreateWithoutTradeOfferInput, TradeOfferItemUncheckedCreateWithoutTradeOfferInput> | TradeOfferItemCreateWithoutTradeOfferInput[] | TradeOfferItemUncheckedCreateWithoutTradeOfferInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutTradeOfferInput | TradeOfferItemCreateOrConnectWithoutTradeOfferInput[]
    createMany?: TradeOfferItemCreateManyTradeOfferInputEnvelope
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
  }

  export type TradeOfferItemUncheckedCreateNestedManyWithoutTradeOfferInput = {
    create?: XOR<TradeOfferItemCreateWithoutTradeOfferInput, TradeOfferItemUncheckedCreateWithoutTradeOfferInput> | TradeOfferItemCreateWithoutTradeOfferInput[] | TradeOfferItemUncheckedCreateWithoutTradeOfferInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutTradeOfferInput | TradeOfferItemCreateOrConnectWithoutTradeOfferInput[]
    createMany?: TradeOfferItemCreateManyTradeOfferInputEnvelope
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
  }

  export type EnumTradeOfferStatusFieldUpdateOperationsInput = {
    set?: $Enums.TradeOfferStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutTradeOffersSentNestedInput = {
    create?: XOR<UserCreateWithoutTradeOffersSentInput, UserUncheckedCreateWithoutTradeOffersSentInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradeOffersSentInput
    upsert?: UserUpsertWithoutTradeOffersSentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTradeOffersSentInput, UserUpdateWithoutTradeOffersSentInput>, UserUncheckedUpdateWithoutTradeOffersSentInput>
  }

  export type UserUpdateOneRequiredWithoutTradeOffersReceivedNestedInput = {
    create?: XOR<UserCreateWithoutTradeOffersReceivedInput, UserUncheckedCreateWithoutTradeOffersReceivedInput>
    connectOrCreate?: UserCreateOrConnectWithoutTradeOffersReceivedInput
    upsert?: UserUpsertWithoutTradeOffersReceivedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTradeOffersReceivedInput, UserUpdateWithoutTradeOffersReceivedInput>, UserUncheckedUpdateWithoutTradeOffersReceivedInput>
  }

  export type TradeOfferItemUpdateManyWithoutTradeOfferNestedInput = {
    create?: XOR<TradeOfferItemCreateWithoutTradeOfferInput, TradeOfferItemUncheckedCreateWithoutTradeOfferInput> | TradeOfferItemCreateWithoutTradeOfferInput[] | TradeOfferItemUncheckedCreateWithoutTradeOfferInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutTradeOfferInput | TradeOfferItemCreateOrConnectWithoutTradeOfferInput[]
    upsert?: TradeOfferItemUpsertWithWhereUniqueWithoutTradeOfferInput | TradeOfferItemUpsertWithWhereUniqueWithoutTradeOfferInput[]
    createMany?: TradeOfferItemCreateManyTradeOfferInputEnvelope
    set?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    disconnect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    delete?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    update?: TradeOfferItemUpdateWithWhereUniqueWithoutTradeOfferInput | TradeOfferItemUpdateWithWhereUniqueWithoutTradeOfferInput[]
    updateMany?: TradeOfferItemUpdateManyWithWhereWithoutTradeOfferInput | TradeOfferItemUpdateManyWithWhereWithoutTradeOfferInput[]
    deleteMany?: TradeOfferItemScalarWhereInput | TradeOfferItemScalarWhereInput[]
  }

  export type TradeOfferItemUncheckedUpdateManyWithoutTradeOfferNestedInput = {
    create?: XOR<TradeOfferItemCreateWithoutTradeOfferInput, TradeOfferItemUncheckedCreateWithoutTradeOfferInput> | TradeOfferItemCreateWithoutTradeOfferInput[] | TradeOfferItemUncheckedCreateWithoutTradeOfferInput[]
    connectOrCreate?: TradeOfferItemCreateOrConnectWithoutTradeOfferInput | TradeOfferItemCreateOrConnectWithoutTradeOfferInput[]
    upsert?: TradeOfferItemUpsertWithWhereUniqueWithoutTradeOfferInput | TradeOfferItemUpsertWithWhereUniqueWithoutTradeOfferInput[]
    createMany?: TradeOfferItemCreateManyTradeOfferInputEnvelope
    set?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    disconnect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    delete?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    connect?: TradeOfferItemWhereUniqueInput | TradeOfferItemWhereUniqueInput[]
    update?: TradeOfferItemUpdateWithWhereUniqueWithoutTradeOfferInput | TradeOfferItemUpdateWithWhereUniqueWithoutTradeOfferInput[]
    updateMany?: TradeOfferItemUpdateManyWithWhereWithoutTradeOfferInput | TradeOfferItemUpdateManyWithWhereWithoutTradeOfferInput[]
    deleteMany?: TradeOfferItemScalarWhereInput | TradeOfferItemScalarWhereInput[]
  }

  export type TradeOfferCreateNestedOneWithoutItemsInput = {
    create?: XOR<TradeOfferCreateWithoutItemsInput, TradeOfferUncheckedCreateWithoutItemsInput>
    connectOrCreate?: TradeOfferCreateOrConnectWithoutItemsInput
    connect?: TradeOfferWhereUniqueInput
  }

  export type CardCreateNestedOneWithoutTradeOfferItemsInput = {
    create?: XOR<CardCreateWithoutTradeOfferItemsInput, CardUncheckedCreateWithoutTradeOfferItemsInput>
    connectOrCreate?: CardCreateOrConnectWithoutTradeOfferItemsInput
    connect?: CardWhereUniqueInput
  }

  export type EnumTradeOfferItemRoleFieldUpdateOperationsInput = {
    set?: $Enums.TradeOfferItemRole
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TradeOfferUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<TradeOfferCreateWithoutItemsInput, TradeOfferUncheckedCreateWithoutItemsInput>
    connectOrCreate?: TradeOfferCreateOrConnectWithoutItemsInput
    upsert?: TradeOfferUpsertWithoutItemsInput
    connect?: TradeOfferWhereUniqueInput
    update?: XOR<XOR<TradeOfferUpdateToOneWithWhereWithoutItemsInput, TradeOfferUpdateWithoutItemsInput>, TradeOfferUncheckedUpdateWithoutItemsInput>
  }

  export type CardUpdateOneRequiredWithoutTradeOfferItemsNestedInput = {
    create?: XOR<CardCreateWithoutTradeOfferItemsInput, CardUncheckedCreateWithoutTradeOfferItemsInput>
    connectOrCreate?: CardCreateOrConnectWithoutTradeOfferItemsInput
    upsert?: CardUpsertWithoutTradeOfferItemsInput
    connect?: CardWhereUniqueInput
    update?: XOR<XOR<CardUpdateToOneWithWhereWithoutTradeOfferItemsInput, CardUpdateWithoutTradeOfferItemsInput>, CardUncheckedUpdateWithoutTradeOfferItemsInput>
  }

  export type UserCreateNestedOneWithoutAppOrdersInput = {
    create?: XOR<UserCreateWithoutAppOrdersInput, UserUncheckedCreateWithoutAppOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppOrdersInput
    connect?: UserWhereUniqueInput
  }

  export type OrderRevisionCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderRevisionCreateWithoutOrderInput, OrderRevisionUncheckedCreateWithoutOrderInput> | OrderRevisionCreateWithoutOrderInput[] | OrderRevisionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutOrderInput | OrderRevisionCreateOrConnectWithoutOrderInput[]
    createMany?: OrderRevisionCreateManyOrderInputEnvelope
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
  }

  export type OrderCommunicationCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderCommunicationCreateWithoutOrderInput, OrderCommunicationUncheckedCreateWithoutOrderInput> | OrderCommunicationCreateWithoutOrderInput[] | OrderCommunicationUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutOrderInput | OrderCommunicationCreateOrConnectWithoutOrderInput[]
    createMany?: OrderCommunicationCreateManyOrderInputEnvelope
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
  }

  export type OrderRevisionUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderRevisionCreateWithoutOrderInput, OrderRevisionUncheckedCreateWithoutOrderInput> | OrderRevisionCreateWithoutOrderInput[] | OrderRevisionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutOrderInput | OrderRevisionCreateOrConnectWithoutOrderInput[]
    createMany?: OrderRevisionCreateManyOrderInputEnvelope
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
  }

  export type OrderCommunicationUncheckedCreateNestedManyWithoutOrderInput = {
    create?: XOR<OrderCommunicationCreateWithoutOrderInput, OrderCommunicationUncheckedCreateWithoutOrderInput> | OrderCommunicationCreateWithoutOrderInput[] | OrderCommunicationUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutOrderInput | OrderCommunicationCreateOrConnectWithoutOrderInput[]
    createMany?: OrderCommunicationCreateManyOrderInputEnvelope
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutAppOrdersNestedInput = {
    create?: XOR<UserCreateWithoutAppOrdersInput, UserUncheckedCreateWithoutAppOrdersInput>
    connectOrCreate?: UserCreateOrConnectWithoutAppOrdersInput
    upsert?: UserUpsertWithoutAppOrdersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAppOrdersInput, UserUpdateWithoutAppOrdersInput>, UserUncheckedUpdateWithoutAppOrdersInput>
  }

  export type OrderRevisionUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderRevisionCreateWithoutOrderInput, OrderRevisionUncheckedCreateWithoutOrderInput> | OrderRevisionCreateWithoutOrderInput[] | OrderRevisionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutOrderInput | OrderRevisionCreateOrConnectWithoutOrderInput[]
    upsert?: OrderRevisionUpsertWithWhereUniqueWithoutOrderInput | OrderRevisionUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderRevisionCreateManyOrderInputEnvelope
    set?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    disconnect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    delete?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    update?: OrderRevisionUpdateWithWhereUniqueWithoutOrderInput | OrderRevisionUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderRevisionUpdateManyWithWhereWithoutOrderInput | OrderRevisionUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderRevisionScalarWhereInput | OrderRevisionScalarWhereInput[]
  }

  export type OrderCommunicationUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderCommunicationCreateWithoutOrderInput, OrderCommunicationUncheckedCreateWithoutOrderInput> | OrderCommunicationCreateWithoutOrderInput[] | OrderCommunicationUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutOrderInput | OrderCommunicationCreateOrConnectWithoutOrderInput[]
    upsert?: OrderCommunicationUpsertWithWhereUniqueWithoutOrderInput | OrderCommunicationUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderCommunicationCreateManyOrderInputEnvelope
    set?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    disconnect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    delete?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    update?: OrderCommunicationUpdateWithWhereUniqueWithoutOrderInput | OrderCommunicationUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderCommunicationUpdateManyWithWhereWithoutOrderInput | OrderCommunicationUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderCommunicationScalarWhereInput | OrderCommunicationScalarWhereInput[]
  }

  export type OrderRevisionUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderRevisionCreateWithoutOrderInput, OrderRevisionUncheckedCreateWithoutOrderInput> | OrderRevisionCreateWithoutOrderInput[] | OrderRevisionUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderRevisionCreateOrConnectWithoutOrderInput | OrderRevisionCreateOrConnectWithoutOrderInput[]
    upsert?: OrderRevisionUpsertWithWhereUniqueWithoutOrderInput | OrderRevisionUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderRevisionCreateManyOrderInputEnvelope
    set?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    disconnect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    delete?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    connect?: OrderRevisionWhereUniqueInput | OrderRevisionWhereUniqueInput[]
    update?: OrderRevisionUpdateWithWhereUniqueWithoutOrderInput | OrderRevisionUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderRevisionUpdateManyWithWhereWithoutOrderInput | OrderRevisionUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderRevisionScalarWhereInput | OrderRevisionScalarWhereInput[]
  }

  export type OrderCommunicationUncheckedUpdateManyWithoutOrderNestedInput = {
    create?: XOR<OrderCommunicationCreateWithoutOrderInput, OrderCommunicationUncheckedCreateWithoutOrderInput> | OrderCommunicationCreateWithoutOrderInput[] | OrderCommunicationUncheckedCreateWithoutOrderInput[]
    connectOrCreate?: OrderCommunicationCreateOrConnectWithoutOrderInput | OrderCommunicationCreateOrConnectWithoutOrderInput[]
    upsert?: OrderCommunicationUpsertWithWhereUniqueWithoutOrderInput | OrderCommunicationUpsertWithWhereUniqueWithoutOrderInput[]
    createMany?: OrderCommunicationCreateManyOrderInputEnvelope
    set?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    disconnect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    delete?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    connect?: OrderCommunicationWhereUniqueInput | OrderCommunicationWhereUniqueInput[]
    update?: OrderCommunicationUpdateWithWhereUniqueWithoutOrderInput | OrderCommunicationUpdateWithWhereUniqueWithoutOrderInput[]
    updateMany?: OrderCommunicationUpdateManyWithWhereWithoutOrderInput | OrderCommunicationUpdateManyWithWhereWithoutOrderInput[]
    deleteMany?: OrderCommunicationScalarWhereInput | OrderCommunicationScalarWhereInput[]
  }

  export type AppOrderCreateNestedOneWithoutRevisionsInput = {
    create?: XOR<AppOrderCreateWithoutRevisionsInput, AppOrderUncheckedCreateWithoutRevisionsInput>
    connectOrCreate?: AppOrderCreateOrConnectWithoutRevisionsInput
    connect?: AppOrderWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOrderRevisionsInput = {
    create?: XOR<UserCreateWithoutOrderRevisionsInput, UserUncheckedCreateWithoutOrderRevisionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrderRevisionsInput
    connect?: UserWhereUniqueInput
  }

  export type AppOrderUpdateOneRequiredWithoutRevisionsNestedInput = {
    create?: XOR<AppOrderCreateWithoutRevisionsInput, AppOrderUncheckedCreateWithoutRevisionsInput>
    connectOrCreate?: AppOrderCreateOrConnectWithoutRevisionsInput
    upsert?: AppOrderUpsertWithoutRevisionsInput
    connect?: AppOrderWhereUniqueInput
    update?: XOR<XOR<AppOrderUpdateToOneWithWhereWithoutRevisionsInput, AppOrderUpdateWithoutRevisionsInput>, AppOrderUncheckedUpdateWithoutRevisionsInput>
  }

  export type UserUpdateOneRequiredWithoutOrderRevisionsNestedInput = {
    create?: XOR<UserCreateWithoutOrderRevisionsInput, UserUncheckedCreateWithoutOrderRevisionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrderRevisionsInput
    upsert?: UserUpsertWithoutOrderRevisionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrderRevisionsInput, UserUpdateWithoutOrderRevisionsInput>, UserUncheckedUpdateWithoutOrderRevisionsInput>
  }

  export type AppOrderCreateNestedOneWithoutCommunicationsInput = {
    create?: XOR<AppOrderCreateWithoutCommunicationsInput, AppOrderUncheckedCreateWithoutCommunicationsInput>
    connectOrCreate?: AppOrderCreateOrConnectWithoutCommunicationsInput
    connect?: AppOrderWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOrderCommunicationsInput = {
    create?: XOR<UserCreateWithoutOrderCommunicationsInput, UserUncheckedCreateWithoutOrderCommunicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrderCommunicationsInput
    connect?: UserWhereUniqueInput
  }

  export type AppOrderUpdateOneRequiredWithoutCommunicationsNestedInput = {
    create?: XOR<AppOrderCreateWithoutCommunicationsInput, AppOrderUncheckedCreateWithoutCommunicationsInput>
    connectOrCreate?: AppOrderCreateOrConnectWithoutCommunicationsInput
    upsert?: AppOrderUpsertWithoutCommunicationsInput
    connect?: AppOrderWhereUniqueInput
    update?: XOR<XOR<AppOrderUpdateToOneWithWhereWithoutCommunicationsInput, AppOrderUpdateWithoutCommunicationsInput>, AppOrderUncheckedUpdateWithoutCommunicationsInput>
  }

  export type UserUpdateOneRequiredWithoutOrderCommunicationsNestedInput = {
    create?: XOR<UserCreateWithoutOrderCommunicationsInput, UserUncheckedCreateWithoutOrderCommunicationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrderCommunicationsInput
    upsert?: UserUpsertWithoutOrderCommunicationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrderCommunicationsInput, UserUpdateWithoutOrderCommunicationsInput>, UserUncheckedUpdateWithoutOrderCommunicationsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumTradeOfferStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferStatus | EnumTradeOfferStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferStatusFilter<$PrismaModel> | $Enums.TradeOfferStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumTradeOfferStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferStatus | EnumTradeOfferStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferStatus[] | ListEnumTradeOfferStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferStatusWithAggregatesFilter<$PrismaModel> | $Enums.TradeOfferStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeOfferStatusFilter<$PrismaModel>
    _max?: NestedEnumTradeOfferStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTradeOfferItemRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferItemRole | EnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferItemRoleFilter<$PrismaModel> | $Enums.TradeOfferItemRole
  }

  export type NestedEnumTradeOfferItemRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeOfferItemRole | EnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TradeOfferItemRole[] | ListEnumTradeOfferItemRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTradeOfferItemRoleWithAggregatesFilter<$PrismaModel> | $Enums.TradeOfferItemRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTradeOfferItemRoleFilter<$PrismaModel>
    _max?: NestedEnumTradeOfferItemRoleFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type CardCreateWithoutOwnerInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutCardInput
    tradeOfferItems?: TradeOfferItemCreateNestedManyWithoutCardInput
  }

  export type CardUncheckedCreateWithoutOwnerInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutCardInput
    tradeOfferItems?: TradeOfferItemUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardCreateOrConnectWithoutOwnerInput = {
    where: CardWhereUniqueInput
    create: XOR<CardCreateWithoutOwnerInput, CardUncheckedCreateWithoutOwnerInput>
  }

  export type CardCreateManyOwnerInputEnvelope = {
    data: CardCreateManyOwnerInput | CardCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutFromUserInput = {
    id?: string
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    toUser?: UserCreateNestedOneWithoutTransactionsToInput
    card?: CardCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateWithoutFromUserInput = {
    id?: string
    toUserId?: string | null
    cardId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutFromUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutFromUserInput, TransactionUncheckedCreateWithoutFromUserInput>
  }

  export type TransactionCreateManyFromUserInputEnvelope = {
    data: TransactionCreateManyFromUserInput | TransactionCreateManyFromUserInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutToUserInput = {
    id?: string
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromUser?: UserCreateNestedOneWithoutTransactionsFromInput
    card?: CardCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateWithoutToUserInput = {
    id?: string
    fromUserId?: string | null
    cardId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutToUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutToUserInput, TransactionUncheckedCreateWithoutToUserInput>
  }

  export type TransactionCreateManyToUserInputEnvelope = {
    data: TransactionCreateManyToUserInput | TransactionCreateManyToUserInput[]
    skipDuplicates?: boolean
  }

  export type TradeOfferCreateWithoutSenderInput = {
    id?: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    receiver: UserCreateNestedOneWithoutTradeOffersReceivedInput
    items?: TradeOfferItemCreateNestedManyWithoutTradeOfferInput
  }

  export type TradeOfferUncheckedCreateWithoutSenderInput = {
    id?: string
    receiverId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TradeOfferItemUncheckedCreateNestedManyWithoutTradeOfferInput
  }

  export type TradeOfferCreateOrConnectWithoutSenderInput = {
    where: TradeOfferWhereUniqueInput
    create: XOR<TradeOfferCreateWithoutSenderInput, TradeOfferUncheckedCreateWithoutSenderInput>
  }

  export type TradeOfferCreateManySenderInputEnvelope = {
    data: TradeOfferCreateManySenderInput | TradeOfferCreateManySenderInput[]
    skipDuplicates?: boolean
  }

  export type TradeOfferCreateWithoutReceiverInput = {
    id?: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutTradeOffersSentInput
    items?: TradeOfferItemCreateNestedManyWithoutTradeOfferInput
  }

  export type TradeOfferUncheckedCreateWithoutReceiverInput = {
    id?: string
    senderId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TradeOfferItemUncheckedCreateNestedManyWithoutTradeOfferInput
  }

  export type TradeOfferCreateOrConnectWithoutReceiverInput = {
    where: TradeOfferWhereUniqueInput
    create: XOR<TradeOfferCreateWithoutReceiverInput, TradeOfferUncheckedCreateWithoutReceiverInput>
  }

  export type TradeOfferCreateManyReceiverInputEnvelope = {
    data: TradeOfferCreateManyReceiverInput | TradeOfferCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type AppOrderCreateWithoutUserInput = {
    id?: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    revisions?: OrderRevisionCreateNestedManyWithoutOrderInput
    communications?: OrderCommunicationCreateNestedManyWithoutOrderInput
  }

  export type AppOrderUncheckedCreateWithoutUserInput = {
    id?: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    revisions?: OrderRevisionUncheckedCreateNestedManyWithoutOrderInput
    communications?: OrderCommunicationUncheckedCreateNestedManyWithoutOrderInput
  }

  export type AppOrderCreateOrConnectWithoutUserInput = {
    where: AppOrderWhereUniqueInput
    create: XOR<AppOrderCreateWithoutUserInput, AppOrderUncheckedCreateWithoutUserInput>
  }

  export type AppOrderCreateManyUserInputEnvelope = {
    data: AppOrderCreateManyUserInput | AppOrderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrderRevisionCreateWithoutUserInput = {
    id?: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    order: AppOrderCreateNestedOneWithoutRevisionsInput
  }

  export type OrderRevisionUncheckedCreateWithoutUserInput = {
    id?: string
    orderId: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderRevisionCreateOrConnectWithoutUserInput = {
    where: OrderRevisionWhereUniqueInput
    create: XOR<OrderRevisionCreateWithoutUserInput, OrderRevisionUncheckedCreateWithoutUserInput>
  }

  export type OrderRevisionCreateManyUserInputEnvelope = {
    data: OrderRevisionCreateManyUserInput | OrderRevisionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type OrderCommunicationCreateWithoutUserInput = {
    id?: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    order: AppOrderCreateNestedOneWithoutCommunicationsInput
  }

  export type OrderCommunicationUncheckedCreateWithoutUserInput = {
    id?: string
    orderId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCommunicationCreateOrConnectWithoutUserInput = {
    where: OrderCommunicationWhereUniqueInput
    create: XOR<OrderCommunicationCreateWithoutUserInput, OrderCommunicationUncheckedCreateWithoutUserInput>
  }

  export type OrderCommunicationCreateManyUserInputEnvelope = {
    data: OrderCommunicationCreateManyUserInput | OrderCommunicationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CardUpsertWithWhereUniqueWithoutOwnerInput = {
    where: CardWhereUniqueInput
    update: XOR<CardUpdateWithoutOwnerInput, CardUncheckedUpdateWithoutOwnerInput>
    create: XOR<CardCreateWithoutOwnerInput, CardUncheckedCreateWithoutOwnerInput>
  }

  export type CardUpdateWithWhereUniqueWithoutOwnerInput = {
    where: CardWhereUniqueInput
    data: XOR<CardUpdateWithoutOwnerInput, CardUncheckedUpdateWithoutOwnerInput>
  }

  export type CardUpdateManyWithWhereWithoutOwnerInput = {
    where: CardScalarWhereInput
    data: XOR<CardUpdateManyMutationInput, CardUncheckedUpdateManyWithoutOwnerInput>
  }

  export type CardScalarWhereInput = {
    AND?: CardScalarWhereInput | CardScalarWhereInput[]
    OR?: CardScalarWhereInput[]
    NOT?: CardScalarWhereInput | CardScalarWhereInput[]
    id?: StringFilter<"Card"> | string
    name?: StringFilter<"Card"> | string
    description?: StringFilter<"Card"> | string
    imageUrl?: StringFilter<"Card"> | string
    rarity?: StringFilter<"Card"> | string
    category?: StringFilter<"Card"> | string
    company?: StringFilter<"Card"> | string
    valuation?: FloatFilter<"Card"> | number
    marketCap?: FloatNullableFilter<"Card"> | number | null
    volume24h?: FloatFilter<"Card"> | number
    priceChange24h?: FloatFilter<"Card"> | number
    attributes?: JsonFilter<"Card">
    metadata?: JsonFilter<"Card">
    ownerId?: StringNullableFilter<"Card"> | string | null
    isListed?: BoolFilter<"Card"> | boolean
    createdAt?: DateTimeFilter<"Card"> | Date | string
    updatedAt?: DateTimeFilter<"Card"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutFromUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutFromUserInput, TransactionUncheckedUpdateWithoutFromUserInput>
    create: XOR<TransactionCreateWithoutFromUserInput, TransactionUncheckedCreateWithoutFromUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutFromUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutFromUserInput, TransactionUncheckedUpdateWithoutFromUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutFromUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutFromUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: StringFilter<"Transaction"> | string
    fromUserId?: StringNullableFilter<"Transaction"> | string | null
    toUserId?: StringNullableFilter<"Transaction"> | string | null
    cardId?: StringNullableFilter<"Transaction"> | string | null
    amount?: FloatFilter<"Transaction"> | number
    currency?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    status?: StringFilter<"Transaction"> | string
    reference?: StringNullableFilter<"Transaction"> | string | null
    metadata?: JsonFilter<"Transaction">
    createdAt?: DateTimeFilter<"Transaction"> | Date | string
    updatedAt?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutToUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutToUserInput, TransactionUncheckedUpdateWithoutToUserInput>
    create: XOR<TransactionCreateWithoutToUserInput, TransactionUncheckedCreateWithoutToUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutToUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutToUserInput, TransactionUncheckedUpdateWithoutToUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutToUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutToUserInput>
  }

  export type TradeOfferUpsertWithWhereUniqueWithoutSenderInput = {
    where: TradeOfferWhereUniqueInput
    update: XOR<TradeOfferUpdateWithoutSenderInput, TradeOfferUncheckedUpdateWithoutSenderInput>
    create: XOR<TradeOfferCreateWithoutSenderInput, TradeOfferUncheckedCreateWithoutSenderInput>
  }

  export type TradeOfferUpdateWithWhereUniqueWithoutSenderInput = {
    where: TradeOfferWhereUniqueInput
    data: XOR<TradeOfferUpdateWithoutSenderInput, TradeOfferUncheckedUpdateWithoutSenderInput>
  }

  export type TradeOfferUpdateManyWithWhereWithoutSenderInput = {
    where: TradeOfferScalarWhereInput
    data: XOR<TradeOfferUpdateManyMutationInput, TradeOfferUncheckedUpdateManyWithoutSenderInput>
  }

  export type TradeOfferScalarWhereInput = {
    AND?: TradeOfferScalarWhereInput | TradeOfferScalarWhereInput[]
    OR?: TradeOfferScalarWhereInput[]
    NOT?: TradeOfferScalarWhereInput | TradeOfferScalarWhereInput[]
    id?: StringFilter<"TradeOffer"> | string
    senderId?: StringFilter<"TradeOffer"> | string
    receiverId?: StringFilter<"TradeOffer"> | string
    status?: EnumTradeOfferStatusFilter<"TradeOffer"> | $Enums.TradeOfferStatus
    message?: StringNullableFilter<"TradeOffer"> | string | null
    expiresAt?: DateTimeNullableFilter<"TradeOffer"> | Date | string | null
    createdAt?: DateTimeFilter<"TradeOffer"> | Date | string
    updatedAt?: DateTimeFilter<"TradeOffer"> | Date | string
  }

  export type TradeOfferUpsertWithWhereUniqueWithoutReceiverInput = {
    where: TradeOfferWhereUniqueInput
    update: XOR<TradeOfferUpdateWithoutReceiverInput, TradeOfferUncheckedUpdateWithoutReceiverInput>
    create: XOR<TradeOfferCreateWithoutReceiverInput, TradeOfferUncheckedCreateWithoutReceiverInput>
  }

  export type TradeOfferUpdateWithWhereUniqueWithoutReceiverInput = {
    where: TradeOfferWhereUniqueInput
    data: XOR<TradeOfferUpdateWithoutReceiverInput, TradeOfferUncheckedUpdateWithoutReceiverInput>
  }

  export type TradeOfferUpdateManyWithWhereWithoutReceiverInput = {
    where: TradeOfferScalarWhereInput
    data: XOR<TradeOfferUpdateManyMutationInput, TradeOfferUncheckedUpdateManyWithoutReceiverInput>
  }

  export type AppOrderUpsertWithWhereUniqueWithoutUserInput = {
    where: AppOrderWhereUniqueInput
    update: XOR<AppOrderUpdateWithoutUserInput, AppOrderUncheckedUpdateWithoutUserInput>
    create: XOR<AppOrderCreateWithoutUserInput, AppOrderUncheckedCreateWithoutUserInput>
  }

  export type AppOrderUpdateWithWhereUniqueWithoutUserInput = {
    where: AppOrderWhereUniqueInput
    data: XOR<AppOrderUpdateWithoutUserInput, AppOrderUncheckedUpdateWithoutUserInput>
  }

  export type AppOrderUpdateManyWithWhereWithoutUserInput = {
    where: AppOrderScalarWhereInput
    data: XOR<AppOrderUpdateManyMutationInput, AppOrderUncheckedUpdateManyWithoutUserInput>
  }

  export type AppOrderScalarWhereInput = {
    AND?: AppOrderScalarWhereInput | AppOrderScalarWhereInput[]
    OR?: AppOrderScalarWhereInput[]
    NOT?: AppOrderScalarWhereInput | AppOrderScalarWhereInput[]
    id?: StringFilter<"AppOrder"> | string
    userId?: StringFilter<"AppOrder"> | string
    projectType?: StringFilter<"AppOrder"> | string
    title?: StringFilter<"AppOrder"> | string
    description?: StringFilter<"AppOrder"> | string
    requirements?: JsonFilter<"AppOrder">
    timeline?: StringFilter<"AppOrder"> | string
    estimatedCost?: FloatFilter<"AppOrder"> | number
    currency?: StringFilter<"AppOrder"> | string
    status?: StringFilter<"AppOrder"> | string
    priority?: StringFilter<"AppOrder"> | string
    progressPercentage?: IntFilter<"AppOrder"> | number
    completedAt?: DateTimeNullableFilter<"AppOrder"> | Date | string | null
    createdAt?: DateTimeFilter<"AppOrder"> | Date | string
    updatedAt?: DateTimeFilter<"AppOrder"> | Date | string
  }

  export type OrderRevisionUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderRevisionWhereUniqueInput
    update: XOR<OrderRevisionUpdateWithoutUserInput, OrderRevisionUncheckedUpdateWithoutUserInput>
    create: XOR<OrderRevisionCreateWithoutUserInput, OrderRevisionUncheckedCreateWithoutUserInput>
  }

  export type OrderRevisionUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderRevisionWhereUniqueInput
    data: XOR<OrderRevisionUpdateWithoutUserInput, OrderRevisionUncheckedUpdateWithoutUserInput>
  }

  export type OrderRevisionUpdateManyWithWhereWithoutUserInput = {
    where: OrderRevisionScalarWhereInput
    data: XOR<OrderRevisionUpdateManyMutationInput, OrderRevisionUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderRevisionScalarWhereInput = {
    AND?: OrderRevisionScalarWhereInput | OrderRevisionScalarWhereInput[]
    OR?: OrderRevisionScalarWhereInput[]
    NOT?: OrderRevisionScalarWhereInput | OrderRevisionScalarWhereInput[]
    id?: StringFilter<"OrderRevision"> | string
    orderId?: StringFilter<"OrderRevision"> | string
    userId?: StringFilter<"OrderRevision"> | string
    revisionNumber?: IntFilter<"OrderRevision"> | number
    title?: StringFilter<"OrderRevision"> | string
    description?: StringFilter<"OrderRevision"> | string
    status?: StringFilter<"OrderRevision"> | string
    approvedAt?: DateTimeNullableFilter<"OrderRevision"> | Date | string | null
    rejectedAt?: DateTimeNullableFilter<"OrderRevision"> | Date | string | null
    createdAt?: DateTimeFilter<"OrderRevision"> | Date | string
    updatedAt?: DateTimeFilter<"OrderRevision"> | Date | string
  }

  export type OrderCommunicationUpsertWithWhereUniqueWithoutUserInput = {
    where: OrderCommunicationWhereUniqueInput
    update: XOR<OrderCommunicationUpdateWithoutUserInput, OrderCommunicationUncheckedUpdateWithoutUserInput>
    create: XOR<OrderCommunicationCreateWithoutUserInput, OrderCommunicationUncheckedCreateWithoutUserInput>
  }

  export type OrderCommunicationUpdateWithWhereUniqueWithoutUserInput = {
    where: OrderCommunicationWhereUniqueInput
    data: XOR<OrderCommunicationUpdateWithoutUserInput, OrderCommunicationUncheckedUpdateWithoutUserInput>
  }

  export type OrderCommunicationUpdateManyWithWhereWithoutUserInput = {
    where: OrderCommunicationScalarWhereInput
    data: XOR<OrderCommunicationUpdateManyMutationInput, OrderCommunicationUncheckedUpdateManyWithoutUserInput>
  }

  export type OrderCommunicationScalarWhereInput = {
    AND?: OrderCommunicationScalarWhereInput | OrderCommunicationScalarWhereInput[]
    OR?: OrderCommunicationScalarWhereInput[]
    NOT?: OrderCommunicationScalarWhereInput | OrderCommunicationScalarWhereInput[]
    id?: StringFilter<"OrderCommunication"> | string
    orderId?: StringFilter<"OrderCommunication"> | string
    userId?: StringFilter<"OrderCommunication"> | string
    messageType?: StringFilter<"OrderCommunication"> | string
    subject?: StringFilter<"OrderCommunication"> | string
    message?: StringFilter<"OrderCommunication"> | string
    isFromAdmin?: BoolFilter<"OrderCommunication"> | boolean
    read?: BoolFilter<"OrderCommunication"> | boolean
    important?: BoolFilter<"OrderCommunication"> | boolean
    createdAt?: DateTimeFilter<"OrderCommunication"> | Date | string
    updatedAt?: DateTimeFilter<"OrderCommunication"> | Date | string
  }

  export type UserCreateWithoutCardsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCardsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCardsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCardsInput, UserUncheckedCreateWithoutCardsInput>
  }

  export type TransactionCreateWithoutCardInput = {
    id?: string
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    fromUser?: UserCreateNestedOneWithoutTransactionsFromInput
    toUser?: UserCreateNestedOneWithoutTransactionsToInput
  }

  export type TransactionUncheckedCreateWithoutCardInput = {
    id?: string
    fromUserId?: string | null
    toUserId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateOrConnectWithoutCardInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutCardInput, TransactionUncheckedCreateWithoutCardInput>
  }

  export type TransactionCreateManyCardInputEnvelope = {
    data: TransactionCreateManyCardInput | TransactionCreateManyCardInput[]
    skipDuplicates?: boolean
  }

  export type TradeOfferItemCreateWithoutCardInput = {
    id?: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
    tradeOffer: TradeOfferCreateNestedOneWithoutItemsInput
  }

  export type TradeOfferItemUncheckedCreateWithoutCardInput = {
    id?: string
    tradeOfferId: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
  }

  export type TradeOfferItemCreateOrConnectWithoutCardInput = {
    where: TradeOfferItemWhereUniqueInput
    create: XOR<TradeOfferItemCreateWithoutCardInput, TradeOfferItemUncheckedCreateWithoutCardInput>
  }

  export type TradeOfferItemCreateManyCardInputEnvelope = {
    data: TradeOfferItemCreateManyCardInput | TradeOfferItemCreateManyCardInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutCardsInput = {
    update: XOR<UserUpdateWithoutCardsInput, UserUncheckedUpdateWithoutCardsInput>
    create: XOR<UserCreateWithoutCardsInput, UserUncheckedCreateWithoutCardsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCardsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCardsInput, UserUncheckedUpdateWithoutCardsInput>
  }

  export type UserUpdateWithoutCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TransactionUpsertWithWhereUniqueWithoutCardInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutCardInput, TransactionUncheckedUpdateWithoutCardInput>
    create: XOR<TransactionCreateWithoutCardInput, TransactionUncheckedCreateWithoutCardInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutCardInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutCardInput, TransactionUncheckedUpdateWithoutCardInput>
  }

  export type TransactionUpdateManyWithWhereWithoutCardInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutCardInput>
  }

  export type TradeOfferItemUpsertWithWhereUniqueWithoutCardInput = {
    where: TradeOfferItemWhereUniqueInput
    update: XOR<TradeOfferItemUpdateWithoutCardInput, TradeOfferItemUncheckedUpdateWithoutCardInput>
    create: XOR<TradeOfferItemCreateWithoutCardInput, TradeOfferItemUncheckedCreateWithoutCardInput>
  }

  export type TradeOfferItemUpdateWithWhereUniqueWithoutCardInput = {
    where: TradeOfferItemWhereUniqueInput
    data: XOR<TradeOfferItemUpdateWithoutCardInput, TradeOfferItemUncheckedUpdateWithoutCardInput>
  }

  export type TradeOfferItemUpdateManyWithWhereWithoutCardInput = {
    where: TradeOfferItemScalarWhereInput
    data: XOR<TradeOfferItemUpdateManyMutationInput, TradeOfferItemUncheckedUpdateManyWithoutCardInput>
  }

  export type TradeOfferItemScalarWhereInput = {
    AND?: TradeOfferItemScalarWhereInput | TradeOfferItemScalarWhereInput[]
    OR?: TradeOfferItemScalarWhereInput[]
    NOT?: TradeOfferItemScalarWhereInput | TradeOfferItemScalarWhereInput[]
    id?: StringFilter<"TradeOfferItem"> | string
    tradeOfferId?: StringFilter<"TradeOfferItem"> | string
    cardId?: StringFilter<"TradeOfferItem"> | string
    role?: EnumTradeOfferItemRoleFilter<"TradeOfferItem"> | $Enums.TradeOfferItemRole
    quantity?: IntFilter<"TradeOfferItem"> | number
    createdAt?: DateTimeFilter<"TradeOfferItem"> | Date | string
  }

  export type UserCreateWithoutTransactionsFromInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsFromInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsFromInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsFromInput, UserUncheckedCreateWithoutTransactionsFromInput>
  }

  export type UserCreateWithoutTransactionsToInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTransactionsToInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTransactionsToInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsToInput, UserUncheckedCreateWithoutTransactionsToInput>
  }

  export type CardCreateWithoutTransactionsInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutCardsInput
    tradeOfferItems?: TradeOfferItemCreateNestedManyWithoutCardInput
  }

  export type CardUncheckedCreateWithoutTransactionsInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: string | null
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    tradeOfferItems?: TradeOfferItemUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardCreateOrConnectWithoutTransactionsInput = {
    where: CardWhereUniqueInput
    create: XOR<CardCreateWithoutTransactionsInput, CardUncheckedCreateWithoutTransactionsInput>
  }

  export type UserUpsertWithoutTransactionsFromInput = {
    update: XOR<UserUpdateWithoutTransactionsFromInput, UserUncheckedUpdateWithoutTransactionsFromInput>
    create: XOR<UserCreateWithoutTransactionsFromInput, UserUncheckedCreateWithoutTransactionsFromInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsFromInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsFromInput, UserUncheckedUpdateWithoutTransactionsFromInput>
  }

  export type UserUpdateWithoutTransactionsFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsFromInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutTransactionsToInput = {
    update: XOR<UserUpdateWithoutTransactionsToInput, UserUncheckedUpdateWithoutTransactionsToInput>
    create: XOR<UserCreateWithoutTransactionsToInput, UserUncheckedCreateWithoutTransactionsToInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsToInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsToInput, UserUncheckedUpdateWithoutTransactionsToInput>
  }

  export type UserUpdateWithoutTransactionsToInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsToInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CardUpsertWithoutTransactionsInput = {
    update: XOR<CardUpdateWithoutTransactionsInput, CardUncheckedUpdateWithoutTransactionsInput>
    create: XOR<CardCreateWithoutTransactionsInput, CardUncheckedCreateWithoutTransactionsInput>
    where?: CardWhereInput
  }

  export type CardUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: CardWhereInput
    data: XOR<CardUpdateWithoutTransactionsInput, CardUncheckedUpdateWithoutTransactionsInput>
  }

  export type CardUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutCardsNestedInput
    tradeOfferItems?: TradeOfferItemUpdateManyWithoutCardNestedInput
  }

  export type CardUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeOfferItems?: TradeOfferItemUncheckedUpdateManyWithoutCardNestedInput
  }

  export type UserCreateWithoutTradeOffersSentInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTradeOffersSentInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTradeOffersSentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTradeOffersSentInput, UserUncheckedCreateWithoutTradeOffersSentInput>
  }

  export type UserCreateWithoutTradeOffersReceivedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTradeOffersReceivedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTradeOffersReceivedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTradeOffersReceivedInput, UserUncheckedCreateWithoutTradeOffersReceivedInput>
  }

  export type TradeOfferItemCreateWithoutTradeOfferInput = {
    id?: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
    card: CardCreateNestedOneWithoutTradeOfferItemsInput
  }

  export type TradeOfferItemUncheckedCreateWithoutTradeOfferInput = {
    id?: string
    cardId: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
  }

  export type TradeOfferItemCreateOrConnectWithoutTradeOfferInput = {
    where: TradeOfferItemWhereUniqueInput
    create: XOR<TradeOfferItemCreateWithoutTradeOfferInput, TradeOfferItemUncheckedCreateWithoutTradeOfferInput>
  }

  export type TradeOfferItemCreateManyTradeOfferInputEnvelope = {
    data: TradeOfferItemCreateManyTradeOfferInput | TradeOfferItemCreateManyTradeOfferInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutTradeOffersSentInput = {
    update: XOR<UserUpdateWithoutTradeOffersSentInput, UserUncheckedUpdateWithoutTradeOffersSentInput>
    create: XOR<UserCreateWithoutTradeOffersSentInput, UserUncheckedCreateWithoutTradeOffersSentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTradeOffersSentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTradeOffersSentInput, UserUncheckedUpdateWithoutTradeOffersSentInput>
  }

  export type UserUpdateWithoutTradeOffersSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTradeOffersSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutTradeOffersReceivedInput = {
    update: XOR<UserUpdateWithoutTradeOffersReceivedInput, UserUncheckedUpdateWithoutTradeOffersReceivedInput>
    create: XOR<UserCreateWithoutTradeOffersReceivedInput, UserUncheckedCreateWithoutTradeOffersReceivedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTradeOffersReceivedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTradeOffersReceivedInput, UserUncheckedUpdateWithoutTradeOffersReceivedInput>
  }

  export type UserUpdateWithoutTradeOffersReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTradeOffersReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TradeOfferItemUpsertWithWhereUniqueWithoutTradeOfferInput = {
    where: TradeOfferItemWhereUniqueInput
    update: XOR<TradeOfferItemUpdateWithoutTradeOfferInput, TradeOfferItemUncheckedUpdateWithoutTradeOfferInput>
    create: XOR<TradeOfferItemCreateWithoutTradeOfferInput, TradeOfferItemUncheckedCreateWithoutTradeOfferInput>
  }

  export type TradeOfferItemUpdateWithWhereUniqueWithoutTradeOfferInput = {
    where: TradeOfferItemWhereUniqueInput
    data: XOR<TradeOfferItemUpdateWithoutTradeOfferInput, TradeOfferItemUncheckedUpdateWithoutTradeOfferInput>
  }

  export type TradeOfferItemUpdateManyWithWhereWithoutTradeOfferInput = {
    where: TradeOfferItemScalarWhereInput
    data: XOR<TradeOfferItemUpdateManyMutationInput, TradeOfferItemUncheckedUpdateManyWithoutTradeOfferInput>
  }

  export type TradeOfferCreateWithoutItemsInput = {
    id?: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sender: UserCreateNestedOneWithoutTradeOffersSentInput
    receiver: UserCreateNestedOneWithoutTradeOffersReceivedInput
  }

  export type TradeOfferUncheckedCreateWithoutItemsInput = {
    id?: string
    senderId: string
    receiverId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeOfferCreateOrConnectWithoutItemsInput = {
    where: TradeOfferWhereUniqueInput
    create: XOR<TradeOfferCreateWithoutItemsInput, TradeOfferUncheckedCreateWithoutItemsInput>
  }

  export type CardCreateWithoutTradeOfferItemsInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutCardsInput
    transactions?: TransactionCreateNestedManyWithoutCardInput
  }

  export type CardUncheckedCreateWithoutTradeOfferItemsInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: string | null
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutCardInput
  }

  export type CardCreateOrConnectWithoutTradeOfferItemsInput = {
    where: CardWhereUniqueInput
    create: XOR<CardCreateWithoutTradeOfferItemsInput, CardUncheckedCreateWithoutTradeOfferItemsInput>
  }

  export type TradeOfferUpsertWithoutItemsInput = {
    update: XOR<TradeOfferUpdateWithoutItemsInput, TradeOfferUncheckedUpdateWithoutItemsInput>
    create: XOR<TradeOfferCreateWithoutItemsInput, TradeOfferUncheckedCreateWithoutItemsInput>
    where?: TradeOfferWhereInput
  }

  export type TradeOfferUpdateToOneWithWhereWithoutItemsInput = {
    where?: TradeOfferWhereInput
    data: XOR<TradeOfferUpdateWithoutItemsInput, TradeOfferUncheckedUpdateWithoutItemsInput>
  }

  export type TradeOfferUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutTradeOffersSentNestedInput
    receiver?: UserUpdateOneRequiredWithoutTradeOffersReceivedNestedInput
  }

  export type TradeOfferUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardUpsertWithoutTradeOfferItemsInput = {
    update: XOR<CardUpdateWithoutTradeOfferItemsInput, CardUncheckedUpdateWithoutTradeOfferItemsInput>
    create: XOR<CardCreateWithoutTradeOfferItemsInput, CardUncheckedCreateWithoutTradeOfferItemsInput>
    where?: CardWhereInput
  }

  export type CardUpdateToOneWithWhereWithoutTradeOfferItemsInput = {
    where?: CardWhereInput
    data: XOR<CardUpdateWithoutTradeOfferItemsInput, CardUncheckedUpdateWithoutTradeOfferItemsInput>
  }

  export type CardUpdateWithoutTradeOfferItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutCardsNestedInput
    transactions?: TransactionUpdateManyWithoutCardNestedInput
  }

  export type CardUncheckedUpdateWithoutTradeOfferItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutCardNestedInput
  }

  export type UserCreateWithoutAppOrdersInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAppOrdersInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAppOrdersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAppOrdersInput, UserUncheckedCreateWithoutAppOrdersInput>
  }

  export type OrderRevisionCreateWithoutOrderInput = {
    id?: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrderRevisionsInput
  }

  export type OrderRevisionUncheckedCreateWithoutOrderInput = {
    id?: string
    userId: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderRevisionCreateOrConnectWithoutOrderInput = {
    where: OrderRevisionWhereUniqueInput
    create: XOR<OrderRevisionCreateWithoutOrderInput, OrderRevisionUncheckedCreateWithoutOrderInput>
  }

  export type OrderRevisionCreateManyOrderInputEnvelope = {
    data: OrderRevisionCreateManyOrderInput | OrderRevisionCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type OrderCommunicationCreateWithoutOrderInput = {
    id?: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutOrderCommunicationsInput
  }

  export type OrderCommunicationUncheckedCreateWithoutOrderInput = {
    id?: string
    userId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCommunicationCreateOrConnectWithoutOrderInput = {
    where: OrderCommunicationWhereUniqueInput
    create: XOR<OrderCommunicationCreateWithoutOrderInput, OrderCommunicationUncheckedCreateWithoutOrderInput>
  }

  export type OrderCommunicationCreateManyOrderInputEnvelope = {
    data: OrderCommunicationCreateManyOrderInput | OrderCommunicationCreateManyOrderInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutAppOrdersInput = {
    update: XOR<UserUpdateWithoutAppOrdersInput, UserUncheckedUpdateWithoutAppOrdersInput>
    create: XOR<UserCreateWithoutAppOrdersInput, UserUncheckedCreateWithoutAppOrdersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAppOrdersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAppOrdersInput, UserUncheckedUpdateWithoutAppOrdersInput>
  }

  export type UserUpdateWithoutAppOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAppOrdersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type OrderRevisionUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderRevisionWhereUniqueInput
    update: XOR<OrderRevisionUpdateWithoutOrderInput, OrderRevisionUncheckedUpdateWithoutOrderInput>
    create: XOR<OrderRevisionCreateWithoutOrderInput, OrderRevisionUncheckedCreateWithoutOrderInput>
  }

  export type OrderRevisionUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderRevisionWhereUniqueInput
    data: XOR<OrderRevisionUpdateWithoutOrderInput, OrderRevisionUncheckedUpdateWithoutOrderInput>
  }

  export type OrderRevisionUpdateManyWithWhereWithoutOrderInput = {
    where: OrderRevisionScalarWhereInput
    data: XOR<OrderRevisionUpdateManyMutationInput, OrderRevisionUncheckedUpdateManyWithoutOrderInput>
  }

  export type OrderCommunicationUpsertWithWhereUniqueWithoutOrderInput = {
    where: OrderCommunicationWhereUniqueInput
    update: XOR<OrderCommunicationUpdateWithoutOrderInput, OrderCommunicationUncheckedUpdateWithoutOrderInput>
    create: XOR<OrderCommunicationCreateWithoutOrderInput, OrderCommunicationUncheckedCreateWithoutOrderInput>
  }

  export type OrderCommunicationUpdateWithWhereUniqueWithoutOrderInput = {
    where: OrderCommunicationWhereUniqueInput
    data: XOR<OrderCommunicationUpdateWithoutOrderInput, OrderCommunicationUncheckedUpdateWithoutOrderInput>
  }

  export type OrderCommunicationUpdateManyWithWhereWithoutOrderInput = {
    where: OrderCommunicationScalarWhereInput
    data: XOR<OrderCommunicationUpdateManyMutationInput, OrderCommunicationUncheckedUpdateManyWithoutOrderInput>
  }

  export type AppOrderCreateWithoutRevisionsInput = {
    id?: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAppOrdersInput
    communications?: OrderCommunicationCreateNestedManyWithoutOrderInput
  }

  export type AppOrderUncheckedCreateWithoutRevisionsInput = {
    id?: string
    userId: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    communications?: OrderCommunicationUncheckedCreateNestedManyWithoutOrderInput
  }

  export type AppOrderCreateOrConnectWithoutRevisionsInput = {
    where: AppOrderWhereUniqueInput
    create: XOR<AppOrderCreateWithoutRevisionsInput, AppOrderUncheckedCreateWithoutRevisionsInput>
  }

  export type UserCreateWithoutOrderRevisionsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrderRevisionsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderCommunications?: OrderCommunicationUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrderRevisionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrderRevisionsInput, UserUncheckedCreateWithoutOrderRevisionsInput>
  }

  export type AppOrderUpsertWithoutRevisionsInput = {
    update: XOR<AppOrderUpdateWithoutRevisionsInput, AppOrderUncheckedUpdateWithoutRevisionsInput>
    create: XOR<AppOrderCreateWithoutRevisionsInput, AppOrderUncheckedCreateWithoutRevisionsInput>
    where?: AppOrderWhereInput
  }

  export type AppOrderUpdateToOneWithWhereWithoutRevisionsInput = {
    where?: AppOrderWhereInput
    data: XOR<AppOrderUpdateWithoutRevisionsInput, AppOrderUncheckedUpdateWithoutRevisionsInput>
  }

  export type AppOrderUpdateWithoutRevisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAppOrdersNestedInput
    communications?: OrderCommunicationUpdateManyWithoutOrderNestedInput
  }

  export type AppOrderUncheckedUpdateWithoutRevisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    communications?: OrderCommunicationUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type UserUpsertWithoutOrderRevisionsInput = {
    update: XOR<UserUpdateWithoutOrderRevisionsInput, UserUncheckedUpdateWithoutOrderRevisionsInput>
    create: XOR<UserCreateWithoutOrderRevisionsInput, UserUncheckedCreateWithoutOrderRevisionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrderRevisionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrderRevisionsInput, UserUncheckedUpdateWithoutOrderRevisionsInput>
  }

  export type UserUpdateWithoutOrderRevisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrderRevisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderCommunications?: OrderCommunicationUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AppOrderCreateWithoutCommunicationsInput = {
    id?: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAppOrdersInput
    revisions?: OrderRevisionCreateNestedManyWithoutOrderInput
  }

  export type AppOrderUncheckedCreateWithoutCommunicationsInput = {
    id?: string
    userId: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    revisions?: OrderRevisionUncheckedCreateNestedManyWithoutOrderInput
  }

  export type AppOrderCreateOrConnectWithoutCommunicationsInput = {
    where: AppOrderWhereUniqueInput
    create: XOR<AppOrderCreateWithoutCommunicationsInput, AppOrderUncheckedCreateWithoutCommunicationsInput>
  }

  export type UserCreateWithoutOrderCommunicationsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrderCommunicationsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash?: string | null
    eceBalance?: number
    refreshToken?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    cards?: CardUncheckedCreateNestedManyWithoutOwnerInput
    transactionsFrom?: TransactionUncheckedCreateNestedManyWithoutFromUserInput
    transactionsTo?: TransactionUncheckedCreateNestedManyWithoutToUserInput
    tradeOffersSent?: TradeOfferUncheckedCreateNestedManyWithoutSenderInput
    tradeOffersReceived?: TradeOfferUncheckedCreateNestedManyWithoutReceiverInput
    appOrders?: AppOrderUncheckedCreateNestedManyWithoutUserInput
    orderRevisions?: OrderRevisionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrderCommunicationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrderCommunicationsInput, UserUncheckedCreateWithoutOrderCommunicationsInput>
  }

  export type AppOrderUpsertWithoutCommunicationsInput = {
    update: XOR<AppOrderUpdateWithoutCommunicationsInput, AppOrderUncheckedUpdateWithoutCommunicationsInput>
    create: XOR<AppOrderCreateWithoutCommunicationsInput, AppOrderUncheckedCreateWithoutCommunicationsInput>
    where?: AppOrderWhereInput
  }

  export type AppOrderUpdateToOneWithWhereWithoutCommunicationsInput = {
    where?: AppOrderWhereInput
    data: XOR<AppOrderUpdateWithoutCommunicationsInput, AppOrderUncheckedUpdateWithoutCommunicationsInput>
  }

  export type AppOrderUpdateWithoutCommunicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAppOrdersNestedInput
    revisions?: OrderRevisionUpdateManyWithoutOrderNestedInput
  }

  export type AppOrderUncheckedUpdateWithoutCommunicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revisions?: OrderRevisionUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type UserUpsertWithoutOrderCommunicationsInput = {
    update: XOR<UserUpdateWithoutOrderCommunicationsInput, UserUncheckedUpdateWithoutOrderCommunicationsInput>
    create: XOR<UserCreateWithoutOrderCommunicationsInput, UserUncheckedCreateWithoutOrderCommunicationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrderCommunicationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrderCommunicationsInput, UserUncheckedUpdateWithoutOrderCommunicationsInput>
  }

  export type UserUpdateWithoutOrderCommunicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrderCommunicationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    eceBalance?: FloatFieldUpdateOperationsInput | number
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cards?: CardUncheckedUpdateManyWithoutOwnerNestedInput
    transactionsFrom?: TransactionUncheckedUpdateManyWithoutFromUserNestedInput
    transactionsTo?: TransactionUncheckedUpdateManyWithoutToUserNestedInput
    tradeOffersSent?: TradeOfferUncheckedUpdateManyWithoutSenderNestedInput
    tradeOffersReceived?: TradeOfferUncheckedUpdateManyWithoutReceiverNestedInput
    appOrders?: AppOrderUncheckedUpdateManyWithoutUserNestedInput
    orderRevisions?: OrderRevisionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CardCreateManyOwnerInput = {
    id?: string
    name: string
    description: string
    imageUrl: string
    rarity: string
    category: string
    company: string
    valuation: number
    marketCap?: number | null
    volume24h?: number
    priceChange24h?: number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyFromUserInput = {
    id?: string
    toUserId?: string | null
    cardId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransactionCreateManyToUserInput = {
    id?: string
    fromUserId?: string | null
    cardId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeOfferCreateManySenderInput = {
    id?: string
    receiverId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeOfferCreateManyReceiverInput = {
    id?: string
    senderId: string
    status?: $Enums.TradeOfferStatus
    message?: string | null
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AppOrderCreateManyUserInput = {
    id?: string
    projectType: string
    title: string
    description: string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline: string
    estimatedCost: number
    currency?: string
    status?: string
    priority?: string
    progressPercentage?: number
    completedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderRevisionCreateManyUserInput = {
    id?: string
    orderId: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCommunicationCreateManyUserInput = {
    id?: string
    orderId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CardUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutCardNestedInput
    tradeOfferItems?: TradeOfferItemUpdateManyWithoutCardNestedInput
  }

  export type CardUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutCardNestedInput
    tradeOfferItems?: TradeOfferItemUncheckedUpdateManyWithoutCardNestedInput
  }

  export type CardUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    imageUrl?: StringFieldUpdateOperationsInput | string
    rarity?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    company?: StringFieldUpdateOperationsInput | string
    valuation?: FloatFieldUpdateOperationsInput | number
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: FloatFieldUpdateOperationsInput | number
    priceChange24h?: FloatFieldUpdateOperationsInput | number
    attributes?: JsonNullValueInput | InputJsonValue
    metadata?: JsonNullValueInput | InputJsonValue
    isListed?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutFromUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    toUser?: UserUpdateOneWithoutTransactionsToNestedInput
    card?: CardUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutFromUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    toUserId?: NullableStringFieldUpdateOperationsInput | string | null
    cardId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutFromUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    toUserId?: NullableStringFieldUpdateOperationsInput | string | null
    cardId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutToUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromUser?: UserUpdateOneWithoutTransactionsFromNestedInput
    card?: CardUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutToUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    cardId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutToUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    cardId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiver?: UserUpdateOneRequiredWithoutTradeOffersReceivedNestedInput
    items?: TradeOfferItemUpdateManyWithoutTradeOfferNestedInput
  }

  export type TradeOfferUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TradeOfferItemUncheckedUpdateManyWithoutTradeOfferNestedInput
  }

  export type TradeOfferUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutTradeOffersSentNestedInput
    items?: TradeOfferItemUpdateManyWithoutTradeOfferNestedInput
  }

  export type TradeOfferUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TradeOfferItemUncheckedUpdateManyWithoutTradeOfferNestedInput
  }

  export type TradeOfferUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    status?: EnumTradeOfferStatusFieldUpdateOperationsInput | $Enums.TradeOfferStatus
    message?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AppOrderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revisions?: OrderRevisionUpdateManyWithoutOrderNestedInput
    communications?: OrderCommunicationUpdateManyWithoutOrderNestedInput
  }

  export type AppOrderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revisions?: OrderRevisionUncheckedUpdateManyWithoutOrderNestedInput
    communications?: OrderCommunicationUncheckedUpdateManyWithoutOrderNestedInput
  }

  export type AppOrderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectType?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    requirements?: JsonNullValueInput | InputJsonValue
    timeline?: StringFieldUpdateOperationsInput | string
    estimatedCost?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    priority?: StringFieldUpdateOperationsInput | string
    progressPercentage?: IntFieldUpdateOperationsInput | number
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: AppOrderUpdateOneRequiredWithoutRevisionsNestedInput
  }

  export type OrderRevisionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    order?: AppOrderUpdateOneRequiredWithoutCommunicationsNestedInput
  }

  export type OrderCommunicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyCardInput = {
    id?: string
    fromUserId?: string | null
    toUserId?: string | null
    amount: number
    currency?: string
    type: string
    status?: string
    reference?: string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeOfferItemCreateManyCardInput = {
    id?: string
    tradeOfferId: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
  }

  export type TransactionUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    fromUser?: UserUpdateOneWithoutTransactionsFromNestedInput
    toUser?: UserUpdateOneWithoutTransactionsToNestedInput
  }

  export type TransactionUncheckedUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    toUserId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromUserId?: NullableStringFieldUpdateOperationsInput | string | null
    toUserId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: FloatFieldUpdateOperationsInput | number
    currency?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reference?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradeOffer?: TradeOfferUpdateOneRequiredWithoutItemsNestedInput
  }

  export type TradeOfferItemUncheckedUpdateWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeOfferId?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemUncheckedUpdateManyWithoutCardInput = {
    id?: StringFieldUpdateOperationsInput | string
    tradeOfferId?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemCreateManyTradeOfferInput = {
    id?: string
    cardId: string
    role: $Enums.TradeOfferItemRole
    quantity?: number
    createdAt?: Date | string
  }

  export type TradeOfferItemUpdateWithoutTradeOfferInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    card?: CardUpdateOneRequiredWithoutTradeOfferItemsNestedInput
  }

  export type TradeOfferItemUncheckedUpdateWithoutTradeOfferInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeOfferItemUncheckedUpdateManyWithoutTradeOfferInput = {
    id?: StringFieldUpdateOperationsInput | string
    cardId?: StringFieldUpdateOperationsInput | string
    role?: EnumTradeOfferItemRoleFieldUpdateOperationsInput | $Enums.TradeOfferItemRole
    quantity?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionCreateManyOrderInput = {
    id?: string
    userId: string
    revisionNumber: number
    title: string
    description: string
    status?: string
    approvedAt?: Date | string | null
    rejectedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderCommunicationCreateManyOrderInput = {
    id?: string
    userId: string
    messageType: string
    subject: string
    message: string
    isFromAdmin?: boolean
    read?: boolean
    important?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrderRevisionUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrderRevisionsNestedInput
  }

  export type OrderRevisionUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderRevisionUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revisionNumber?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rejectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutOrderCommunicationsNestedInput
  }

  export type OrderCommunicationUncheckedUpdateWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrderCommunicationUncheckedUpdateManyWithoutOrderInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    messageType?: StringFieldUpdateOperationsInput | string
    subject?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    isFromAdmin?: BoolFieldUpdateOperationsInput | boolean
    read?: BoolFieldUpdateOperationsInput | boolean
    important?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}