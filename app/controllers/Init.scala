package controllers

import scala.slick.driver.H2Driver.simple._
import play.api.Play

// Required import for the sql interpolator
import scala.slick.jdbc.StaticQuery.interpolation
import model.{Image, Peoples}
import play.api.mvc._

object Init extends Controller {
  //TODO: move to DBAction when it will support async
  def MyDatabase =
    Database.forURL(
      driver = Play.current.configuration.getString("db.default.driver").get,
      url = Play.current.configuration.getString("db.default.url").get,
      user = Play.current.configuration.getString("db.default.user").get,
      password = Play.current.configuration.getString("db.default.password").get)

  val peoples: TableQuery[Peoples] = TableQuery[Peoples]
  val images: TableQuery[Image] = TableQuery[Image]

  def init() = Action {
    // Create a connection (called a "session") to an in-memory H2 database
    MyDatabase.withSession {
      implicit session =>
        // Construct a SQL statement manually with an interpolated value
        try {
          val plainQuery = sql"select count(*) from IMAGES".as[Int]
          plainQuery.first()

          Ok("Already initialized")
        } catch {
          case e: Exception =>
            // Create the schema by combining the DDLs
            val ddl = peoples.ddl ++ images.ddl
            ddl.create
            val rez = ddl.createStatements.reduce(_ + _)
            // Insert data
            (0 to 100).foreach { i =>
              peoples.insert(People.createOne(i))
            }

            Ok("Initialized with SQL: <br>" + rez)
        }

    }
  }

}
