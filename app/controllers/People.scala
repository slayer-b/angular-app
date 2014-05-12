package controllers

import play.api.mvc._
import play.api.libs.json.{Json, _}
import play.api.libs.concurrent.Promise

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.language.postfixOps
import scala.concurrent.Future

import scala.slick.driver.H2Driver.simple._
import scala.slick.driver.H2Driver.simple.{Session => SlickSession}

import model._

object People extends Controller {
  implicit val userReads = Json.reads[UserData]
  implicit val userWrites = Json.writes[UserData]

  def save = Action.async(parse.json) { implicit request =>
    Json.fromJson[UserData](request.body).map { data =>
      Init.MyDatabase.withSession {
        implicit session =>
          val query = for {
            p <- Init.peoples if p.id === data.id
          } yield p

          val p = query.run
          if (p.isEmpty) Init.peoples.insert(data)
          else Init.peoples.update(data)
      }

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
    Init.MyDatabase.withSession {
      implicit session =>
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
  }

  def detail(id: Int) = Action.async {
    Init.MyDatabase.withSession { implicit session =>

        val query = for {
          p <- Init.peoples if p.id === id
        } yield p

        val p = query.run
        val data =
          if (p.isEmpty) generate(id)
          else Json.toJson(p(0))

        Promise.timeout(Ok(Json.obj(
          "result" -> data
        )), 1 second)
    }
  }

  def generate(id: Int)(implicit session: SlickSession) = {
    val query = for {
      p <- Init.peoples if p.id === id
    } yield p

    val p = query.run

    if (p.isEmpty) Json.obj(
      "id" -> id,
      "name" -> s"Some name #$id",
      "age" -> id,
      "money" -> id * 10,
      "img" -> "favicon.png",
      "detail" -> s"Some detail #$id")
    else Json.toJson(p(0))
  }
}
