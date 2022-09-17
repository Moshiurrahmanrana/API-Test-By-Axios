const { doesNotMatch } = require('assert');
const axios = require('axios');
const { expect } = require('chai');
const fs = require('fs');
const envVariables = require('./env.json');
const {randomId} = require('./randomId');
const {faker} = require('@faker-js/faker');

describe('User Api Automation', async () => {
    it("User can do login Successfully", async () => {
        var { data } = await axios.post(`${envVariables.baseUrl}/user/login`, {
            "email": "salman@grr.la",
            "password": "1234"
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        var token = data.token;
        envVariables.token = token;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables));
    })
    var id;
    it("User can view list if having proper authentication", async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/list`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token
            }
        })
        id = data.users[0].id;
        console.log(data.users[0].id);

    })
    it("User can view selected user", async () => {
        var { data } = await axios.get(`${envVariables.baseUrl}/user/search?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data.user.name);
        expect(data.user.name).contains('Utshow');
    })
    it("Create new user", async() => {
        var {data} = await axios.post(`${envVariables.baseUrl}/user/create`, {
            "name": `${faker.name.firstName()} ${faker.name.lastName()}`,
            "email": `rana${randomId(100000,999999)}@grr.lrr`,
            "password": "1234",
            "phone_number": `01512${randomId(100000,999999)}`,
            "nid": "8726384762",
            "role": "admin"

        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': envVariables.token,
                'X-AUTH-SECRET-KEY': envVariables['X-AUTH-SECRET-KEY']
            }
        })
        console.log(data);
        // expect(data.message).contains('User created successfully');
        envVariables.id = data.user.id;
        envVariables.name = data.user.name;
        envVariables.email = data.user.email;
        envVariables.phoneNumber = data.user.phone_number;
        fs.writeFileSync('./env.json', JSON.stringify(envVariables));
    })
})