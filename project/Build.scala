import sbt._
import Keys._

object ApplicationBuild extends Build {

  val appName         = "test-angular"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
//    jdbc,
//    anorm,
    "com.typesafe.slick" %% "slick" % "2.0.0"
  )

  val main = Project(appName, file(".")).enablePlugins(play.PlayScala).settings(
    version := appVersion,
    libraryDependencies ++= appDependencies
  )

}
