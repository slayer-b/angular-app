package db

import scala.concurrent.Future
import play.api.mvc.{Action, Result}

class MyDBAction {
  final def async(block: => Future[Result]) = Action.async {
    block
  }
}
