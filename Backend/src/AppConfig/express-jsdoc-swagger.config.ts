import * as path from 'path';
import { fileURLToPath } from 'url';
import appConfig from './app.config';
import environment from '@/lib/environment';
import { Environments } from '@/enums/environment.enum';

const { env, port } = environment;
const {
  api: { basePath, version },
  docs: { swaggerUIPath, apiDocsPath },
} = appConfig;
const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const baseDir = path.join(currentDir, '../../');
const expressJSDocSwaggerConfig = {
  info: {
    version: '1.0.0',
    title: 'Rest Api',
    description: 'Api specs for',
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: `${environment.appUrl}:${port}/{basePath}/{version}`,
      description: 'Express Server',
      variables: {
        port: {
          default: port,
        },
        basePath: {
          default: basePath,
        },
        version: {
          default: version,
        },
      },
    },
  ],
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
    },
  },
  baseDir,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: `${baseDir}/src/**/*.route.ts`,
  // URL where SwaggerUI will be rendered
  swaggerUIPath,
  // Expose OpenAPI UI
  exposeSwaggerUI: env !== Environments.PRODUCTION,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: env !== Environments.PRODUCTION,
  // Open API JSON Docs endpoint.
  apiDocsPath,
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};

export default expressJSDocSwaggerConfig;
