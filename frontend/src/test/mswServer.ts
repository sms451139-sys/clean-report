import { setupServer } from 'msw/node'
import { reportHandlers } from './handlers/reportHandlers'

export const server = setupServer(...reportHandlers)
