import PaymentGateways from "../paymentGateways"
import { Router } from "express"

class NotificationsRoute {
  constructor(router: Router) {
    this.registerRoutes(router)
  }
  registerRoutes(router: Router) {
    router.post(
      "/v1/notifications/:gateway",
      this.paymentNotification.bind(this)
    )
  }

  paymentNotification(req, res) {
    PaymentGateways.paymentNotification(req, res, req.params.gateway)
  }
}

export default NotificationsRoute
