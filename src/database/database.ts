import { Kysely } from 'kysely';

import { Tables } from './database.types';

export class Database extends Kysely<Tables> {}
