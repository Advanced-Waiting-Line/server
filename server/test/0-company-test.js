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
        name: "Lorem",
        address: "Ipsum",
        openTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
        closeTime: "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)",
        location: {
          lat: -6.260181,
          lng: 106.780505,
         },
        image: process.env.IMAGE_BASE64,
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
        expect(res.body).to.have.keys(['_id', 'name', 'address', 'openTime', "closeTime", "location", "image", "email", "password", "queue", "createdAt", "updatedAt", "__v"])
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
    it("Should error register company with nonBase64 picture; (status: 400)", function (done) {
      let company = {
        name: "abcd",
        email: "abcd@mail.com",
        password: "qwerqwer",
        image: `bababa${process.env.IMAGE_BASE64}`
      }

      chai
        .request(app)
        .post("/companies/register")
        .send(company)
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(400)
          console.log(res.body)
          // expect(res.body).to.have.all.keys('code', 'message');
          // expect(res.body.code).to.equal(400)
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
          expect(res.body).to.have.keys("_id", "name", "token", "email")
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

  //========== Find All Company ==========
  describe("GET /companies/findAll", function () {
    it("Success get all company data with status 200", function(done){
      chai
        .request(app)
        .get(`/companies/findAll`)
        .end(function(err, res){
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an("array")
          done()
        })
    })
  })

  //========== Find Company By Id ==========
  describe("GET /companies/findOne/", function () {
    it("Success get all company data with status 200", function(done){
      chai
        .request(app)
        .get(`/companies/findOne/${idCompany}`)
        .end(function(err, res){
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an("object")
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