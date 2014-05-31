package controllers

import scala.slick.driver.H2Driver.simple._

// Required import for the sql interpolator
import scala.slick.jdbc.StaticQuery.interpolation
import model.{Image, Peoples}
import play.api.mvc._
import scala.slick.driver.H2Driver.simple.{Session => SlickSession}

object Init extends Controller {
  def MyDatabase =
    Database.forURL("jdbc:h2:mem:play", driver = "org.h2.Driver", user = "sa", password = "")

  // The query interface for the Suppliers table
  val peoples: TableQuery[Peoples] = TableQuery[Peoples]
  // the query interface for the Coffees table
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
