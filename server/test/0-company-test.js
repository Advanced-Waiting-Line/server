const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect;
const app = require('../app')
const clearDatabase = require('../helpers/test/clearDatabase')

chai.use(chaiHttp);

after(function(done){
  console.log('database company cleared')
  clearDatabase(done)
})

let idCompany
//========== Company Test ==========
describe(`company test`, function(){
  //========== Register ==========
  this.timeout(10000)
  describe('POST /companies/register', function(){
    it('Sucess register company with status 201', function (done){
      let company = {
        openTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
        closeTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
        location: {},
        image: "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",
        email: "qwer@mail.com",
        password: "qwerqwer",
        queue: [],
      }
      chai
      .request(app)
      .post('/companies/register')
      .send(company)
      .end(function(err,res){
        idCompany = res.body._id
        expect(err).to.be.null
        expect(res).to.have.status(201)
        expect(res.body).to.be.an("object")
        // expect(res.body.openTime).to.equal("Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)")
        expect(res.body.email).to.equal("qwer@mail.com")
        expect(res.body.password).to.not.equal("qwerqwer")
        expect(res.body).to.have.keys(['_id', 'openTime', "closeTime", "image", "email", "password", "queue", "createdAt", "updatedAt", "__v"])
        done()
      })
    })
    it('Should error register company with invalid email and password (status: 400)', function(done){
      let company = {
        name: "qwer",
        email: "qwermai.com",
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
        // expect(res.body.message).to.equal(`Company validation failed: email: ${company.email} is not a valid email`)
        done()
      })
    })
    it("Should error company with empty body (status: 400)", function (done) {
      chai
        .request(app)
        .post("/companies/register")
        .send({})
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400)
          expect(res.body).to.have.all.keys('code', 'message');
          expect(res.body.code).to.equal(400)
          // expect(res.body.message).to.equal('Company validation failed: name: name cannot be empty, email: email cannot be emtpy, password: password cannot be empty')
          done()
        })
    })
    it("Should error register company with duplicate email; (status: 400)", function (done) {
      let company = {
        name: "qwer",
        email: "qwer@mail.com",
        password: "qwerqwer"
      }

      chai
        .request(app)
        .post("/companies/register")
        .send(company)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400)
          expect(res.body).to.have.all.keys('code', 'message');
          expect(res.body.code).to.equal(400)
          // expect(res.body.message).to.equal(`Company validation failed: email: Email ${user.email} has been used`)
          done()
        })
    })
  })

  //========== Login ==========
  describe("POST /companies/login", function () {
    it("Success login company with status 200", function (done) {
      let company = {
        email: "qwer@mail.com",
        password: "qwerqwer"
      };
      chai
        .request(app)
        .post("/companies/login")
        .send(company)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object")
          expect(res.body).to.have.keys("_id", "token", "email")
          done();
        })
    })
    it("Login Failed: wrong email with status 401", function (done) {
      let company = {
        "email": "qwery@mail.com",
        "password": "qwerqwer",
      }
      chai
        .request(app)
        .post("/companies/login")
        .send(company)
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
      let company = {
        email: "qwer@mail.com",
        password: "12345"
      };
      chai
        .request(app)
        .post("/companies/login")
        .send(company)
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

  //========== Clear Queue ==========
  describe("POST /clearQueue/", function () {
    it("Success clear queue company with status 200", function(done){
      chai
        .request(app)
        .post(`/companies/clearQueue/${idCompany}`)
        .end(function(err, res){
          expect(err).to.be.null
          expect(res).to.have.status(200)
          done()
        })
    })
  })
})