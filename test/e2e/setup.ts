import { rm } from 'fs/promises';
import { join } from 'path';

const deleteDatabase = async () => {
    try {
        await rm(join(__dirname, '..', '..', 'test.sqlite'));
    } catch (error) {}
};

global.beforeEach(deleteDatabase);
global.afterAll(deleteDatabase);
