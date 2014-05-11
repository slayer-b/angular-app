package controllers

import play.api.mvc._
import play.api.libs.json.{Json, _}
import play.api.libs.concurrent.Promise

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.language.postfixOps
import scala.concurrent.Future
import model.ImageData

object Images extends Controller {
  var items = Map[Int, JsValue]()

  implicit val userReads = Json.reads[ImageData]
  implicit val userWrites = Json.writes[ImageData]

  def save = Action.async(parse.json) { implicit request =>
    Json.fromJson[ImageData](request.body).map { data =>
      items = items + (data.id -> Json.toJson(data))
      Promise.timeout(Ok(Json.obj(
        "result" -> "Succeed",
        "error" -> false,
        "item" -> data
      )), 1 second)
    }.recoverTotal {
      e => Future(
        BadRequest("Detected error:"+ JsError.toFlatJson(e))
      )
    }
  }

  def list(count: Int, page: Int) = Action.async {
    val first = (page - 1) * count
    val last = page * count - 1
    val rez = JsArray(
      (first to last).map(generate)
    )
    Promise.timeout(Ok(Json.obj(
      "total" -> 100,
      "result" -> rez
    )), 1 second)
  }

  def detail(id: Int) = Action.async {
    Promise.timeout(Ok(Json.obj(
      "result" -> generate(id)
    )), 1 second)
  }

  def generate(id: Int) =
    if (items.contains(id)) items(id)
    else Json.obj(
          "id" -> id,
          "name" -> s"Picture #$id",
          "category" -> s"Some detail #$id",
          "url" -> "favicon.png"
        )

}
