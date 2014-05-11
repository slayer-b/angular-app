package controllers

import scala.slick.driver.H2Driver.simple._
// Required import for the sql interpolator
import scala.slick.jdbc.StaticQuery.interpolation
import model.{Image, Peoples}
import play.api.mvc._

object Init extends Controller {


  // The query interface for the Suppliers table
  val suppliers: TableQuery[Peoples] = TableQuery[Peoples]
  // the query interface for the Coffees table
  val coffees: TableQuery[Image] = TableQuery[Image]

  def init() = Action {
    // Create a connection (called a "session") to an in-memory H2 database
    Database.forURL("jdbc:h2:mem:play", driver = "org.h2.Driver", user = "sa", password = "").withSession {
      implicit session =>
        // Construct a SQL statement manually with an interpolated value
        try {
          val plainQuery = sql"select 1 from IMAGES".as[String]
          plainQuery.list()

          Ok("Already initialized")
        } catch {
          case e: Exception =>
            // Create the schema by combining the DDLs
            val ddl = suppliers.ddl ++ coffees.ddl
            ddl.create
            val rez = ddl.createStatements.reduce(_ + _)
            Ok("Initialized with SQL: <br>" + rez)
        }

    }
  }
}
