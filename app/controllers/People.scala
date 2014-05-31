package controllers

import play.api.mvc._
import play.api.libs.json.{Json, _}
import play.api.libs.concurrent.Promise

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.language.postfixOps
import scala.concurrent.Future

import scala.slick.driver.H2Driver.simple._

import model._

object People extends Controller {
  implicit val userReads = Json.reads[UserData]
  implicit val userWrites = Json.writes[UserData]

  def save = Action.async(parse.json) { implicit request =>
    Json.fromJson[UserData](request.body).map { data =>
      Init.MyDatabase.withSession {
        implicit session =>
          val selectById = for {
            p <- Init.peoples if p.id === data.id
          } yield p

          selectById.update(data)
      }

      Promise.timeout(Ok(Json.obj(
        "result" -> "Succeed",
        "error" -> false,
        "item" -> data
      )), 1 second)
    }.recoverTotal {
      e => Future(
        BadRequest("Detected error:" + JsError.toFlatJson(e))
      )
    }
  }

  def delete(id: Int) = Action.async {
    Init.MyDatabase.withSession { implicit session =>
      val query = for {
        p <- Init.peoples if p.id === id
      } yield p
      query.delete

      Promise.timeout(Ok(Json.obj(
        "result" -> "Succeed",
        "error" -> false
      )), 1 second)
    }
  }

  def list(count: Int, page: Int) = Action.async {
    Init.MyDatabase.withSession {
      implicit session =>
      val first = (page - 1) * count

      val query = for (
        p <- Init.peoples
      ) yield p
      val list = query.drop(first).take(count).list()

      val rez = list.map(o => Json.toJson(o))

      Promise.timeout(Ok(Json.obj(
        "total" -> 100,
        "result" -> rez
      )), 1 second)
    }
  }

  def detail(id: Int) = Action.async {
    Init.MyDatabase.withSession {
      implicit session =>
        val query = for {
          p <- Init.peoples if p.id === id
        } yield p

        Promise.timeout(Ok(Json.obj(
          "result" -> query.first()
        )), 1 second)
    }
  }

  def createOne(id: Int) =
    UserData(
      id,
      s"Some name #$id",
      id,
      id * 10,
      "favicon.png",
      s"Some detail #$id"
    )

}
