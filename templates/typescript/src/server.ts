import App from '@/app'
import Controllers from '@controllers'
import { validateEnv } from '@utils'

validateEnv()

const app = new App(Controllers)
app.listen()
