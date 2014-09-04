import scala.collection.JavaConverters._
import scala.sys.process._

object TsCompiler {

  def runCompiler(command: Seq[String]): String = {
    val process = Process(command, None, System.getenv().asScala.toSeq: _*).run()
    command.mkString(" ")
  }

}