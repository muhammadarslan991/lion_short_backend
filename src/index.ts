import express, { Express, Request, Response } from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as http from 'http'
import * as os from 'os'
import cors from 'cors'
import morgan from 'morgan'

import { connectDatabase } from './config/db-init'
import IndexRouter from './router/index'

const configureMiddleware = (app: Express): void => {
  const root = path.normalize(`${__dirname}/../..`)
  app.set('appPath', `${root}client`)

  const requestLimit = process.env.REQUEST_LIMIT || '1000kb'

  app.use(bodyParser.json({ limit: requestLimit }))
  app.use(bodyParser.urlencoded({ extended: true, limit: requestLimit }))
  app.use(bodyParser.text({ limit: requestLimit }))
  app.use(express.static(`${root}/public`))
  app.use(cors())
  app.use(morgan('dev'))
}

const configureRoutes = (app: Express): void => {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ msg: 'API is working' })
  })

  app.use('/api', IndexRouter)
}

const startServer = (app: Express, port: number): void => {
  const welcome = (p: number) => () => {
    const msg = `Up and running in ${
      process.env.NODE_ENV || 'development'
    } @: ${os.hostname()} on port: ${p}`
    console.info(msg)
    return msg
  }

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Path not found' })
  })

  http.createServer(app).listen(port, welcome(port))
}

const createExpressServer = (): Express => express()

const startApp = async (): Promise<void> => {
  try {
    const app = createExpressServer()

    // Connect to the database
    await connectDatabase()

    // Configure app middleware
    configureMiddleware(app)
    // Configure routes
    configureRoutes(app)

    const port = parseInt(process.env.PORT || '1337', 10)
    startServer(app, port)
  } catch (error) {
    console.error('Error starting the app:', error)
    process.exit(1) // Exit the process with an error code
  }
}

startApp()
