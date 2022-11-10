import 'reflect-metadata'

import Controllers from '@controllers'
import { validateEnv } from '@utils'

import App from '@/app'

validateEnv()

const app = new App(Controllers)
app.listen()
