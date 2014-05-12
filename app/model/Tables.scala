package model

import scala.slick.driver.H2Driver.simple._

case class UserData(
                     id: Int,
                     name: String,
                     age: Int,
                     money: Int,
                     img: String,
                     detail: String
                   )

class Peoples(tag: Tag) extends Table[UserData](tag, "PEOPLE") {
  def id: Column[Int] = column[Int]("ID", O.PrimaryKey) // This is the primary key column
  def name: Column[String] = column[String]("NAME")
  def age: Column[Int] = column[Int]("AGE")
  def money: Column[Int] = column[Int]("MONEY")
  def img: Column[String] = column[String]("IMG")
  def detail: Column[String] = column[String]("DETAIL")

  // Every table needs a * projection with the same type as the table's type parameter
  def * = (id, name, age, money, img, detail) <>
    (UserData.tupled, UserData.unapply)
}

case class ImageData(
                      id: Int,
                      name: String,
                      category: String,
                      url: String
                    )

class Image(tag: Tag) extends Table[ImageData](tag, "IMAGES") {
  def id: Column[Int] = column[Int]("ID", O.PrimaryKey) // This is the primary key column
  def name: Column[String] = column[String]("NAME")
  def category: Column[String] = column[String]("CATEGORY")
  def url: Column[String] = column[String]("URL")

  // Every table needs a * projection with the same type as the table's type parameter
  def * = (id, name, category, url) <>
    (ImageData.tupled, ImageData.unapply)
}