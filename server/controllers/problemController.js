const Problem = require('../model/Problem')

class ProblemController {
  static findAll(req,res,next){
    Problem.find({})
    .then(problems =>{
      res.json(problems)
    })
    .catch(err=>{
      next(err)
    })
  }

  static getCompanyProblem(req,res,next){
    Problem.find({
      companyId: req.params.companyId
    })
    .then(problems=>{
      res.json(problems)
    })
    .catch(err=>{
      next(err)
    })
  }

  static create(req,res,next){
      console.log(req.decode)
      const {name, duration} = req.body
      const companyId = req.decode._id
      Problem.create({
        name,
        duration,
        companyId
      }).then(problem =>{
        res.status(201).json(problem)
      }).catch(next)
  }

  
}

module.exports = ProblemController