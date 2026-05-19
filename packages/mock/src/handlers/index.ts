import { authHandlers } from './auth'
import { chartHandlers } from './chart'
import { dashboardHandlers } from './dashboard'
import { dictionaryHandlers } from './dictionary'
import { navigationHandlers } from './navigation'
import { roleHandlers } from './role'
import { routeHandlers } from './route'
import { screenHandlers } from './screen'
import { shareHandlers } from './share'
import { systemMetaHandlers } from './system-meta'
import { userHandlers } from './user'

export const handlers = [
  ...userHandlers,
  ...chartHandlers,
  ...authHandlers,
  ...navigationHandlers,
  ...dashboardHandlers,
  ...dictionaryHandlers,
  ...roleHandlers,
  ...systemMetaHandlers,
  ...screenHandlers,
  ...routeHandlers,
  ...shareHandlers,
]
