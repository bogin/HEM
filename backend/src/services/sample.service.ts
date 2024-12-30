import { Sample } from '../types';
import sampleRepository from '../repositories/sample.repository';

export class SampleService {
    private readonly CACHE_DURATION = 5000;
    private sampleCache: Map<number, { samples: Sample[]; timestamp: number }> = new Map();

    async getSamplesForPerson(personId: number): Promise<Sample[]> {
        const cached = this.sampleCache.get(personId);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            return cached.samples;
        }

        const samples = await sampleRepository.findSamplesByPersonId(personId);

        this.sampleCache.set(personId, {
            samples,
            timestamp: Date.now()
        });

        return samples;
    }

    clearCache(personId?: number) {
        if (personId) {
            this.sampleCache.delete(personId);
        } else {
            this.sampleCache.clear();
        }
    }
}

const sampleService = new SampleService();
export default sampleService;