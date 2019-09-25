const Problem = require('../model/Problem')
const db = require('../extend appjs/firestore')

class ProblemController {
  // static findAll(req,res,next){
  //   Problem.find({})
  //   .then(problems =>{
  //     res.json(problems)
  //   })
  //   .catch(err=>{
  //     next(err)
  //   })
  // }

  static getCompanyProblem(req,res,next){
    Problem.find({
      companyId: req.params.companyId
    })
    .populate('companyId')
    .then(problems=>{
      res.json(problems)
    })
    .catch(err=>{
      next(err)
    })
  }

  static create(req,res,next){
    const {name, duration, description} = req.body
    const companyId = req.decode._id
    Problem.create({
      name,
      duration,
      description,
      companyId
    }).then(problem =>{
      res.status(201).json(problem)
    }).catch(next)
  }

  static delete(req,res,next){
    Problem.findOneAndRemove({
      _id: req.params.problemId
    })
    .then(result=>{
      res.json(result)
    })
    .catch(next)
  }

  static update(req,res,next){
    const {duration, name, description} = req.body
    console.log(description, '<<<<');
    Problem.findOneAndUpdate({
      _id: req.params.problemId
    },{
      $set: {
        duration,
        name,
        description
      }
    },{
      new: true
    })
    .then(result=>{
      return Promise.all([ db.collection('awansub').add({ awan: true }), result])
      // res.json(result)
    })
    .then(([firebase, result])=> {
      res.json(result)
    })
    .catch(next)
  }
  
}

module.exports = ProblemController