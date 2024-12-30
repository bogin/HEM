import db from '../config/database';
import { Sample } from '../types';

class SampleRepository {
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

const sampleRepository = new SampleRepository();
export default sampleRepository;