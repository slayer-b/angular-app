import org.apache.commons.io.FileUtils
import sbt.Keys._
import sbt._

import scala.collection.JavaConverters._

object ApplicationBuild extends Build {

  val appName         = "test-angular"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Add your project dependencies here,
    "com.typesafe.slick" %% "slick" % "2.0.0",
    "com.typesafe.play" %% "play-slick" % "0.7.0-M1",
    "com.h2database" % "h2" % "1.4.178"
  )

  val base = file(".")
  val main = Project(appName, file(".")).enablePlugins(play.PlayScala).settings(
    version := appVersion,
    libraryDependencies ++= appDependencies,

    compile in Compile <<= (compile in Compile) map { x =>
      val files = FileUtils.listFiles(base, Array("ts"), true)
        .asScala.map {f => f.getCanonicalPath}
      val rez = TsCompiler.runCompiler(
        Seq("tsc") ++ files ++ Seq("--outDir", "public/js"))
      System.out.println(rez)
      x
    }
  )

}
