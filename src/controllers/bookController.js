const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")
const valid = require("../validator/validator")
const reviewModel = require("../models/reviewModel")

//======================createBookApi=============================

const bookCreation = async (req, res) => {

    try {
        let requestBody = req.body

        let { title, excerpt, userId, ISBN, category, subCategory, releasedAt } = requestBody
        if (!valid.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: "request body can't be Empty" })
        }
        if (!title) {
            return res.status(400).send({ status: false, msg: "title of book is mandatory " })
        }
        if (!valid.invalidInput(title)) {
            return res.status(400).send({ status: false, msg: "invalid title input" })
        }
        if (!valid.isValidTitle(title)) {
            return res.status(400).send({ status: false, msg: "plz provide valid title" })
        }

        let usedTitle = await bookModel.findOne({ title })
        if (usedTitle) {
            return res.status(400).send({ status: false, msg: " title is already taken" })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "excerpt is mandatory" })
        }
        if (!valid.invalidInput(excerpt)) {
            return res.status(400).send({ status: false, msg: " pls provide excerpt for book" })

        }
        if (!userId) {
            return res.status(400).send({ status: false, msg: "userId is mandatory" })
        }

        if (!valid.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "pls provide valid userID" })
        }
        let checkUserId = await userModel.findById({_id: userId })
        if (!checkUserId) {
            return res.status(400).send({ status: false, msg: " userId doesn't exist" })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is mandatory" })
        }
        if (!valid.validateISBN(ISBN)) {
            return res.status(400).send({ status: false, msg: " Invalid ISBN  format" })
        }
        let usedISBN = await bookModel.findOne({ ISBN })

        if (usedISBN) {
            return res.status(400).send({ status: false, msg: " ISBN is already used" })
        }
        if (!category) {
            return res.status(400).send({ status: false, msg: "Category is mandatory " })
        }
        if (!valid.isValidName(category)) {
            return res.status(400).send({ status: false, msg: "Invalid category " })
        }
        if (!subCategory) {
            return res.status(400).send({ status: false, msg: "subCategory is mandatory " })
        }
        if (!valid.invalidInput(subCategory)) {
            return res.status(400).send({ status: false, msg: "Invlid subCategory " })
        }
        if (!releasedAt) {
            return res.status(400).send({ status: false, msg: "releasedAt is mandatory " })
        }
        if (!valid.invalidInput(releasedAt)) {
            return res.status(400).send({ status: false, msg: "date should be in YYYY-MM-YY " })
        }

const bookDetails = await bookModel.create(requestBody)
  return res.status(201).send({status:false,msg:"book created successfully",data:bookDetails})
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


//===========================================getBooksQuery==============================================>
const getBooksQuery = async (req, res) => {
  try {
      const reqBody = req.query;
      const { userId, category, subCategory } = reqBody

      if ((Object.keys(reqBody).length === 0) || (userId || category || subCategory)) {
          //-------------------------------book finding----------------------------
          const books = await bookModel.find({ $and: [{ isDeleted: false }, reqBody] }).select({
           title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).collation({ locale: "en" }).sort({ title: 1 });

          if (books.length === 0)
              return res.status(404).send({ status: false, message: 'Book is not found.' });

          return res.status(200).send({ status: true, message: 'Books list', data: books });

      } else
          return res.status(400).send({ status: false, message: 'Invalid query' });

  } catch (err) {
      res.status(500).send({ status: false, error: err.message });
  }
};


//=======================================getBookById========================================

const bookById = async function (req, res) {

  try {

      const reqBookId = req.params.bookId

      if (!valid.invalidInput(reqBookId)) {
          return res.status(400).send({ status: false, msg: "pls provide bookId" })
      }
      if (!valid.isValidObjectId(reqBookId)) {
          return res.status(400).send({ status: false, msg: "invalid bookId" })
      }
      let bookInfo = await bookModel.findOne({ _id: reqBookId, isDeleted: false })
      if (!bookInfo) {
          return res.status(404).send({ status: false, msg: "book not found" })
      }

      let reviewData = await reviewModel.find({ bookId: reqBookId, isDeleted: false })
      const responseData = bookInfo.toObject()
      responseData.reviews = reviewData

      return res.status(200).send({ status: true, msg: " fetching review data successfuly", data: responseData })




  } catch (err) {
      return res.status(500).send({ status: false, msg: err.message })
  }
}


//==========================================updateBook=========================
const updateBook = async function (req, res) {
    try {
      let bookId = req.params.bookId;
      let body = req.body;
  
      if(!valid.isValidRequestBody(body)) return res.status(400).send({status: false, message:"Please provide details in body to update"})
      let { title, excerpt, releasedAt, ISBN } = body;
  
      if (!valid.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId" });
      let updatingBook = await bookModel.findById({ _id: bookId });
      if (!updatingBook) 
        return res.status(404).send({ status: false, message: "Book not found" });
  
      //---------Checking if body attributes are valid---------//
      if (title)
        if (!valid.isValidTitle(title))
        return res.status(400).send({ status: false, message: "Invalid title" });
      if (excerpt)
        if (!valid.invalidInput(excerpt))
        return   res.status(400).send({ status: false, message: "Invalid excerpt" });
      if (releasedAt)
        if (!valid.invalidInput(releasedAt)) {
        return res.status(400).send({ status: false, msg: "date should be in YYYY-MM-YY " })
        }   
      if (ISBN)
        if (!valid.validateISBN(ISBN))
          res.status(400).send({ status: false, message: "Invalid ISBN" });
  
      //--------Cheking if body attributes are duplicate---------//
      let duplicateTitle = await bookModel.findOne({ title: title });
      if (duplicateTitle)
        return res
          .status(400)
          .send({ status: false, message: "Title is already in use" });
  
      let duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
      if (duplicateISBN)
        return res
          .status(400)
          .send({ status: false, message: "ISBN is already in use" });
  
      let updatedBook = await bookModel.findByIdAndUpdate(
        { _id: bookId },
        { $set: body },
        { new: true }
      );
  
      return res
        .status(200)
        .send({ status: true, message: "Success", data: updatedBook });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
//====================deleteApi===================================
const bookDeletion = async function (req, res) {
    try {

        const removeBook = req.params.bookId
        if (!valid.invalidInput(removeBook)) {
            return res.status(400).send({ status: false, msg: "pls provide bookId" })
        }
        if (!valid.isValidObjectId(removeBook)) {
            return res.status(400).send({ status: false, msg: "invalid bookId" })
        }
          if(removeBook){
            const check= await bookModel.findOne({_id:removeBook,isDeleted:false})
            if(!check)
            return res.status(400).send({status:false,msg:"book Id not found"})
            
          }
           let deleteBook = await bookModel.findByIdAndUpdate({ _id: removeBook }, { $set: { isDeleted: true ,deletedAt:Date.now()} }, { new: true })
     return res.status(200).send({status:false,msg:"book deleted successfully",data:deleteBook})
       
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}





module.exports={bookCreation,getBooksQuery,bookById,updateBook,bookDeletion}