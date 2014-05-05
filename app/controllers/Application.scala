package controllers

import play.api._
import play.api.mvc._
import play.api.libs.json.{Json, _}


object Application extends Controller {
  
  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def index2 = Action {
    Ok(views.html.my("Your new application is ready."))
  }

  val generator = new java.util.Random()

  def phone(id: Long) = Action {
    Ok(generate)
  }

  def phones = Action {
    Ok(JsArray(
      (0 to 10).map(i => generate)
    ))
  }

  def generate = {
    val tmpId = generator.nextLong()
    val newId = if (tmpId < 0) -tmpId else tmpId
    val age = Long.MaxValue - newId
    val name = "Some name #" + newId
    val description = "Long description of #" + newId

    Json.obj(
      "id" -> newId,
      "name" -> name,
      "snippet" -> description,
      "age" -> age,
      "b" -> generator.nextBoolean()
    )
  }
  
}