import db from '../config/database';
import { Person, Sample } from '../types';

class PersonRepository {
    async findAllAfter(lastId: number, limit: number): Promise<Person[]> {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM person 
                 WHERE id > ? 
                 ORDER BY id 
                 LIMIT ?`,
                [lastId, limit + 1],
                (err, rows: Person[]) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }

    async findById(id: number): Promise<Person | null> {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM person WHERE id = ?',
                [id],
                (err, row: Person | undefined) => {
                    if (err) reject(err);
                    resolve(row || null);
                }
            );
        });
    }

    async findSamplesByPersonId(personId: number): Promise<Sample[]> {
        return new Promise((resolve, reject) => {
            db.all(
                'SELECT * FROM sample WHERE person_id = ? ORDER BY timestamp',
                [personId],
                (err, rows: Sample[]) => {
                    if (err) reject(err);
                    resolve(rows);
                }
            );
        });
    }
}

const personRepository = new PersonRepository();
export default personRepository;