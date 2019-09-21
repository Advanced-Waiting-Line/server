const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect;
const app = require('../app')
const clearDatabase = require('../helpers/test/clearDatabase')

chai.use(chaiHttp);

after(function(done){
  console.log('database user cleared')
  clearDatabase(done)
})

//========== User Test ==========
describe(`user test`, function(){
  //========== Register ==========
  describe('POST /companies/register', function(){
    it.only('Sucess register with status 201', function (done){
      let company = {
        openTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
        closeTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
        location: "jakarta",
        email: "qwer@mail.com",
        password: "qwerqwer",
        queue: "",
        file: ""
      }
      chai
      .request(app)
      .post('/companies/register')
      .send(company)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(201)
        expect(res.body).to.be.an("object")
        // expect(res.body.openTime).to.equal("Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)")
        // expect(res.body.email).to.equal("qwer@mail.com")
        // expect(res.body.password).to.not.equal("qwerqwer")
        // expect(res.body).to.have.keys(['_id', 'name', 'email', 'password', 'isAdmin', "createdAt", "updatedAt", "__v"])
        done()
      })
    })
    it('Should error register user with invalid email and password (status: 400)', function(done){
      let company = {
        name: "qwer",
        email: "qwemail.com",
        password: "qwerqwer"
      }
      chai
      .request(app)
      .post('/companies/register')
      .send(company)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.have.all.keys('code', 'message');
        expect(res.body.code).to.equal(400)
        expect(res.body.message).to.equal(`User validation failed: email: ${user.email} is not a valid email`)
        done()
      })
    })
    it("Should error register user with empty body (status: 400)", function (done) {
      chai
        .request(app)
        .post("/users/register")
        .send({})
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400)
          expect(res.body).to.have.all.keys('code', 'message');
          expect(res.body.code).to.equal(400)
          expect(res.body.message).to.equal('User validation failed: name: name cannot be empty, email: email cannot be emtpy, password: password cannot be empty')
          done()
        })
    })
    it("Should error register user with duplicate email; (status: 400)", function (done) {
      let user = {
        name: "qwer",
        email: "qwer@mail.com",
        password: "qwerqwer"
      }

      chai
        .request(app)
        .post("/users/register")
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400)
          expect(res.body).to.have.all.keys('code', 'message');
          expect(res.body.code).to.equal(400)
          expect(res.body.message).to.equal(`User validation failed: email: Email ${user.email} has been used`)
          done()
        })
    })
  })

  //========== Login ==========
  describe("POST /users/login", function () {
    it("Success login with status 200", function (done) {
      let user = {
        email: "qwer@mail.com",
        password: "qwerqwer"
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          expect(res.body).to.have.keys("_id","email","name","token", "isAdmin")
          done();
        })
    })
    it("Login Failed: wrong email with status 401", function (done) {
      let user = {
        "email": "qwery@mail.com",
        "password": "qwerqwer",
      }
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(401)
          expect(res.body).to.have.all.keys('code', 'message');
          expect(res.body.code).to.equal(401)
          expect(res.body.message).to.equal('wrong email/password')
          done()
        })
    })
    it("Login Failed: wrong password with status 401", function (done) {
      let user = {
        email: "qwer@mail.com",
        password: "12345"
      };
      chai
        .request(app)
        .post("/users/login")
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(401)
          expect(res.body).to.have.all.keys('code', 'message');
          expect(res.body.code).to.equal(401)
          expect(res.body.message).to.equal('wrong email/password')
          done()
        })
    })
  })
})