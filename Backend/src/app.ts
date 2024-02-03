import fs from 'fs';
import * as path from 'path';
import cors from 'cors';
import nocache from 'nocache';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import expressJSDocSwaggerConfig from './AppConfig/express-jsdoc-swagger.config';
import appConfig from './AppConfig/app.config';
import { setupSession } from './middlewares/session';
import { setupFirebase } from './lib/firebase';
import { authenticationMiddleware } from './lib/authentication/auth.middleware';
import errorHandler from '@/middlewares/error-handler';
import routes from '@/modules/index';
import prismaClient from '@/lib/prisma';
class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.disableSettings();
    this.setRoutes();
    this.setErrorHandler();
    this.initializeDocs();
    setupSession(this.express);
    setupFirebase();
    void this.createUploadDirectory();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(nocache());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(helmet());
    this.express.use(express.static('public'));
    this.express.use(authenticationMiddleware);
  }

  private disableSettings(): void {
    this.express.disable('x-powered-by');
  }

  private setRoutes(): void {
    const {
      api: { version },
    } = appConfig;
    this.express.use(`/api/${version}`, routes);
    this.express.use('/image', express.static('Upload/Images'));
    this.express.use('/video', express.static('Upload/Videos'));
  }

  private setErrorHandler(): void {
    this.express.use(errorHandler);
  }

  private initializeDocs(): void {
    expressJSDocSwagger(this.express)(expressJSDocSwaggerConfig);
  }

  private async createUploadDirectory(): Promise<void> {
    console.log('Creating upload directory...');
    const uploadDirectory = 'Upload';
    const imagesDirectory = path.join(uploadDirectory, 'Images');
    const videosDirectory = path.join(uploadDirectory, 'Videos');

    try {
      // Check if the main upload directory exists
      if (!fs.existsSync(uploadDirectory)) {
        // If not, create it
        fs.mkdirSync(uploadDirectory, { recursive: true });
        console.log(`${uploadDirectory} directory created.`);
      }
      // Check if the images directory exists
      if (!fs.existsSync(imagesDirectory)) {
        // If not, create it
        fs.mkdirSync(imagesDirectory, { recursive: true });
        console.log(`${imagesDirectory} directory created.`);
      }

      // Check if the videos directory exists
      if (!fs.existsSync(videosDirectory)) {
        // If not, create it
        fs.mkdirSync(videosDirectory, { recursive: true });
        console.log(`${videosDirectory} directory created.`);
      }
    } catch (error) {
      console.error('Error creating upload directories:', error);
    }
  }

  public async connectPrisma(): Promise<void> {
    await prismaClient.$connect();
  }
}

export default App;
