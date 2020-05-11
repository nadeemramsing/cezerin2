import security from "../lib/security"
import RedirectsService from "../services/redirects"
import { Router } from "express"

class RedirectsRoute {
  constructor(router: Router) {
    this.registerRoutes(router)
  }
  registerRoutes(router: Router) {
    router.get(
      "/v1/redirects",
      security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
      this.getRedirects.bind(this)
    )
    router.post(
      "/v1/redirects",
      security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
      this.addRedirect.bind(this)
    )
    router.get(
      "/v1/redirects/:id",
      security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
      this.getSingleRedirect.bind(this)
    )
    router.put(
      "/v1/redirects/:id",
      security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
      this.updateRedirect.bind(this)
    )
    router.delete(
      "/v1/redirects/:id",
      security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
      this.deleteRedirect.bind(this)
    )
  }

  getRedirects(res, next) {
    RedirectsService.getRedirects()
      .then(data => res.send(data))
      .catch(next)
  }

  getSingleRedirect(req, res, next) {
    RedirectsService.getSingleRedirect(req.params.id)
      .then(data => {
        if (data) {
          return res.send(data)
        }
        return res.status(404).end()
      })
      .catch(next)
  }

  addRedirect(request: Request, response, next) {
    RedirectsService.addRedirect(request.body)
      .then(data => response.send(data))
      .catch(next)
  }

  updateRedirect(req, res, next) {
    RedirectsService.updateRedirect(req.params.id, req.body)
      .then(data => {
        if (data) {
          return res.send(data)
        }
        return res.status(404).end()
      })
      .catch(next)
  }

  deleteRedirect(req, res, next) {
    RedirectsService.deleteRedirect(req.params.id)
      .then(data => res.status(data ? 200 : 404).end())
      .catch(next)
  }
}

export default RedirectsRoute
