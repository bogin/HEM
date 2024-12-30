import { LazyLoadQuery, LazyLoadResponse, Person, Sample } from '../types';
import personRepository from '../repositories/person.repository';

export class PersonService {
    async getPersons(query: LazyLoadQuery): Promise<LazyLoadResponse<Person>> {
        const { lastId = 0, limit = 20 } = query;

        const persons = await personRepository.findAllAfter(lastId, limit + 1);
        
        const hasMore = persons.length > limit;
        const data = hasMore ? persons.slice(0, -1) : persons;
        const nextCursor = hasMore ? data[data.length - 1].id : undefined;

        return {
            data,
            hasMore,
            nextCursor
        };
    }

    async getPersonById(id: number): Promise<Person | null> {
        return personRepository.findById(id);
    }
}

const personService = new PersonService();
export default personService;