export const Match = Object.freeze({
  MUST: 'must',
  MUST_NOT: 'must_not',
  isMust(match) {
    return match === this.MUST;
  },
  isMustClause(clause) {
    return Match.isMust(clause.match);
  }
});

const Term = Object.freeze({
  TYPE: 'term',
  isInstance: (clause) => {
    return clause.type === Term.TYPE;
  },
  must: (value) => {
    return { type: Term.TYPE, value, match: Match.MUST };
  },
  mustNot: (value) => {
    return { type: Term.TYPE, value, match: Match.MUST_NOT };
  }
});

const Field = Object.freeze({
  TYPE: 'field',
  isInstance: (clause) => {
    return clause.type === Field.TYPE;
  },
  must: (field, value) => {
    return { type: Field.TYPE, field, value, match: Match.MUST };
  },
  mustNot: (field, value) => {
    return { type: Field.TYPE, field, value, match: Match.MUST_NOT };
  }
});

const Is = Object.freeze({
  TYPE: 'is',
  isInstance: (clause) => {
    return clause.type === Is.TYPE;
  },
  must: (flag) => {
    return { type: Is.TYPE, flag, match: Match.MUST };
  },
  mustNot: (flag) => {
    return { type: Is.TYPE, flag, match: Match.MUST_NOT };
  }
});

/**
 * The AST structure is an array of clauses. There are 3 types of clauses that are supported:
 *
 * :term:
 * Holds a VALUE and an OCCUR. The OCCUR indicates whether the value must match or must not match. Default
 * clauses are not associated with any specific field - when executing the search, one can specify what are
 * the default fields that the default clauses will be matched against.
 *
 * :field:
 * Like the `term` clause, holds a VALUE and an MATCH, but this clause also specifies the field that the
 * value will be matched against.
 *
 * :is:
 * Holds a FLAG and indicates whether this flag must be applied or must not be applied. Typically this clause
 * matches against boolean values of a record (e.g. "is:online", "is:internal", "is:on", etc..)
 *
 * This AST is immutable - every "mutating" operation returns a newly mutated AST.
 */
export class _AST {

  static create(clauses) {
    return new _AST(clauses);
  }

  constructor(clauses = []) {
    this._clauses = clauses;
    this._indexedClauses = clauses.reduce((map, clause) => {
      switch (clause.type) {
        case Field.TYPE:
          if (!map.field[clause.field]) {
            map.field[clause.field] = [];
          }
          map.field[clause.field].push(clause);
          return map;
        case Is.TYPE:
          map.is[clause.flag] = clause;
          return map;
        case Term.TYPE:
          map.term.push(clause);
          return map;
        default:
          throw new Error(`Unknown query clause type [${clause.type}]`);
      }
    }, { field: {}, is: {}, term: [] });
  }

  get clauses() {
    return this._clauses;
  }

  getTermClauses() {
    return this._indexedClauses.term;
  }

  getTermClause(value) {
    const clauses = this.getTermClauses();
    return clauses.find(clause => clause.value === value);
  }

  getFieldNames() {
    return Object.keys(this._indexedClauses.field);
  }

  getFieldClauses(field = undefined) {
    return field ?
      this._indexedClauses.field[field] :
      this._clauses.filter(clause => Field.isInstance(clause));
  }

  getFieldClause(field, value) {
    const clauses = this.getFieldClauses(field);
    if (clauses) {
      return clauses.find(clause => clause.value === value);
    }
  }

  /**
   * Returns a new AST with all the current clauses excluding a field clause that is associated
   * with the given field and value. If no such field clause exists, the returns AST will essentially
   * be a new copy of this one.
   */
  removeFieldClause(field, value) {
    return new _AST(this._clauses.filter(clause => {
      return !Field.isInstance(clause) || clause.field !== field || clause.value !== value;
    }));
  }

  /**
   * Creates and returns a new AST with all the current clauses excluding the field clauses that are
   * associated with the given field. If no field is provided, all field clauses will be excluded.
   */
  removeFieldClauses(field = undefined) {
    return new _AST(this._clauses.filter(clause => {
      return !Field.isInstance(clause) || (field && clause.field !== field);
    }));
  }

  getIsClauses() {
    return Object.values(this._indexedClauses.is);
  }

  getIsClause(flag) {
    return this._indexedClauses.is[flag];
  }

  removeIsClause(flag) {
    return new _AST(this._clauses.filter(clause => Is.isInstance(clause) && clause.flag !== flag));
  }

  /**
   * Creates and returns a new AST with the given clause added to the current clauses. If
   * the current clauses already include a similar clause, it will be (in-place) replaced by
   * the given clause. Whether a clause is similar to the given one depends on the type of the clause.
   * Two clauses are similar if:
   *
   * - they are both of the same type
   * - if they are `default` clauses, they must have the same value
   * - if they are `term` clauses, they must have the same fields and values
   * - if they are `is` clauses, they must have the same flags
   *
   * The reasoning behind not including the `match` attributes of the clauses in the rules above, stems
   * in the fact that the AST clauses are ANDed, and having two similar clauses with two different
   * match attributes creates a logically contradicted AST (e.g. what does it mean to
   * "(must have x) AND (must not have x)"?)
   *
   * note:  in-place replacement means the given clause will be placed in the same position as the one it
   *        replaced
   */
  addClause(newClause) {
    let added = false;
    const newClauses = this._clauses.reduce((clauses, clause) => {
      if (newClause.type !== clause.type) {
        clauses.push(clause);
        return clauses;
      }
      switch (newClause.type) {
        case Term.TYPE:
          if (newClause.value !== clause.value) {
            clauses.push(clause);
            return clauses;
          }
          break;
        case Field.TYPE:
          if (newClause.field !== clause.field || newClause.value !== clause.value) {
            clauses.push(clause);
            return clauses;
          }
          break;
        case Is.TYPE:
          if (newClause.flag !== clause.flag) {
            clauses.push(clause);
            return clauses;
          }
          break;
        default:
          throw new Error(`unknown clause type [${newClause.type}]`);
      }
      added = true;
      clauses.push(newClause);
      return clauses;
    }, []);
    if (!added) {
      newClauses.push(newClause);
    }
    return new _AST(newClauses);
  }
}

export const AST = Object.freeze({
  Match,
  Term,
  Field,
  Is,
  create: (clauses) => new _AST(clauses)
});
