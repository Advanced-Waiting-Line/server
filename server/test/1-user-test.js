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
let idUser
//========== User Test ==========
describe(`user test`, function(){
  //========== Register ==========
  this.timeout(10000)
  describe('POST /users/register', function(){
    it('Success register with status 201', function (done){
      let user = {
        firstName: "lorem ",
        lastName: "ipsum",
        image: process.env.IMAGE_BASE64,
        email: "qwer@mail.com",
        password: "qwerqwer",
        location: {
          lat: -6.260181,
          lng: 106.780505,
         },
      }
      chai
      .request(app)
      .post('/users/register')
      .send(user)
      .end(function(err,res){
        idUser = res.body._id
        expect(err).to.be.null
        expect(res).to.have.status(201)
        expect(res.body).to.be.an("object")
        // expect(res.body.firstName).to.equal("lorem")
        expect(res.body.lastName).to.equal("ipsum")
        expect(res.body.email).to.equal("qwer@mail.com")
        expect(res.body.password).to.not.equal("qwerqwer")
        expect(res.body).to.have.keys(['_id', 'firstName', 'lastName', 'location', 'image', 'email', "password", "createdAt", "updatedAt", "__v"])
        done()
      })
    })
    it('Should error register user with invalid email and password (status: 400)', function(done){
      let user = {
        name: "qwer",
        email: "qwemail.com",
        password: "qwerqwer"
      }
      chai
      .request(app)
      .post('/users/register')
      .send(user)
      .end(function(err,res){
        expect(err).to.be.null
        expect(res).to.have.status(400)
        expect(res.body).to.have.all.keys('code', 'message');
        expect(res.body.code).to.equal(400)
        // expect(res.body.message).to.equal(`User validation failed: email: ${user.email} is not a valid email`)
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
          // expect(res.body.message).to.equal('User validation failed: name: name cannot be empty, email: email cannot be emtpy, password: password cannot be empty')
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
          // expect(res.body.message).to.equal(`User validation failed: email: Email ${user.email} has been used`)
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
          expect(res.body).to.have.keys("_id","email", "token")
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

  //========== update ==========
  describe("PATCH /users/update/:id", function () {
    it("Success update with status 200", function (done) {
      let user = {
        firstName: "tata",
        lastName: "ipsum",
        email: "yaya@mail.com",
        image: process.env.IMAGE_BASE64,
        password: "qwerqwer",
        location: {}

      };
      chai
        .request(app)
        .patch(`/users/update/${idUser}`)
        .send(user)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          // expect(res.body.nModified).to.equal(1)
          // expect(res.body).to.have.keys("n","nModified", "ok")
          done();
        })
    })
  })

  //========== Find one User ==========
  describe("GET /users/:id", function () {
    it("Success get user data with status 200", function (done) {
      chai
        .request(app)
        .get(`/users/${idUser}`)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          done();
        })
    })
  })

  //========== delete ==========
  describe("DELETE /users/delete/:id", function () {
    it("Success delete with status 200", function (done) {
      chai
        .request(app)
        .delete(`/users/delete/${idUser}`)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          expect(res.body).to.have.keys("n","deletedCount", "ok")
          expect(res.body.deletedCount).to.equal(1)
          done();
        })
    })
  })
})