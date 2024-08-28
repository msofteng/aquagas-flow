import dotenv from 'dotenv';
import find from 'find';
import Jasmine from 'jasmine';
import { parse } from 'ts-command-line-args';
import logger from 'jet-logger';

interface IArgs {
    testFile: string;
}

const result2 = dotenv.config({
    path: './env/test.env',
});

if (result2.error) {
    throw result2.error;
}

const args = parse<IArgs>({
    testFile: {
        type: String,
        defaultValue: '',
    },
});

const jasmine = new Jasmine();

jasmine.exitOnCompletion = false;

jasmine.loadConfig({
    random: true,
    spec_dir: 'spec',
    spec_files: [
        './tests/**/*.spec.ts',
    ],
    stopSpecOnExpectationFailure: false,
});

let execResp: Promise<jasmine.JasmineDoneInfo> | undefined;

if (args.testFile) {
    const testFile = args.testFile;
    find.file(testFile + '.spec.ts', './spec', (files: string[]) => {
        if (files.length === 1) {
            jasmine.execute([files[0]]);
        } else {
            logger.err('Test file not found!');
        }
    });
} else {
    execResp = jasmine.execute();
}

(async () => {
    if (!!execResp) {
        const info = await execResp;
        if (info.overallStatus === 'passed') {
            logger.info('All tests have passed :)');
        } else {
            logger.err('At least one test has failed :(');
        }
    }
})();