import {
  CREDENTIALS,
  DATABASE_URL,
  LOG_ACCESS,
  NODE_ENV,
  ORIGIN,
  PORT,
  SESSION_SECRET,
} from '@config'
import { Request } from '@interfaces'
import { errorMiddleware } from '@middlewares'
import { globalLogger, stream } from '@utils'
import bodyParser from 'body-parser'
import { defaultMetadataStorage } from 'class-transformer'
import { validationMetadatasToSchemas } from 'class-validator-jsonschema'
import compression from 'compression'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers'
import { routingControllersToSpec } from 'routing-controllers-openapi'
import swaggerUi from 'swagger-ui-express'

class App {
  public app: express.Application
  public env: string
  public port: string | number

  constructor(Controllers: Function[]) {
    this.app = express()
    this.env = NODE_ENV || 'development'
    this.port = PORT || 3000

    this.initializeMiddlewares()
    this.initializeRoutes(Controllers)
    this.initializeSwagger(Controllers)
    this.initializeErrorHandling()
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      globalLogger.info(`=================================`)
      globalLogger.info(`======= ENV: ${this.env} ========`)
      globalLogger.info(`🚀 App listening on the port ${this.port}`)
      globalLogger.info(`=================================`)
    })
    server.on('error', error => {
      globalLogger.error(error)
    })
    return server
  }

  public getServer() {
    return this.app
  }

  private initializeMiddlewares() {
    this.app.use(
      bodyParser.json({
        verify: (req: Request, res, buf) => {
          req.rawBody = buf
        },
      }),
    )
    if (LOG_ACCESS) this.app.use(morgan('dev', { stream }))
    this.app.use(hpp())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())
    this.app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
          mongoUrl: DATABASE_URL,
          touchAfter: 1 * 3600,
          ttl: 2 * 60 * 60,
        }),
      }),
    )
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      cors: {
        origin: ORIGIN,
        credentials: CREDENTIALS,
      },
      controllers,
      defaultErrorHandler: false,
    })
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    })

    const routingControllersOptions = {
      controllers,
    }

    const storage = getMetadataArgsStorage()
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Generated with `routing-controllers-openapi`',
        title: 'A sample API',
        version: '1.0.0',
      },
    })

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }
}

export default App
