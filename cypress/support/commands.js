// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import moment from 'moment'
import loginPage from './pages/login'
import dashPage from './pages/dash'

const apiServer = Cypress.env('apiServer')

Cypress.Commands.add('uiLogin', (user) => {
    loginPage.go()
    loginPage.form(user)
    loginPage.submit()
    dashPage.header.userLoggedIn(user.name)
})

Cypress.Commands.add('postUser', (user) => {
    cy.task('removeUser', user.email)
        .then(function (result) {
            console.log(result)
        })

    cy.request(
        'POST',
        apiServer + '/users',
        user
    ).then(function (response) {
        expect(response.status).eq(200)
    })
})

Cypress.Commands.add('recoveryPass', (email) => {
    cy.request(
        'POST',
        apiServer + '/forgot',
        { email: email }
    ).then(function (response) {
        expect(response.status).eq(204)

        cy.task('findToken', email).then((result) => {
            Cypress.env('recoveryToken', result.token)
        })
    })
})

Cypress.Commands.add('createAppointment', (hour) => {

    let now = new Date()
    now.setDate(now.getDate() + 1)

    cy.log(now)
    Cypress.env('appointmentDate', now)

    const date = moment(now).format(`YYYY-MM-DD ${hour}:00`)

    const payload = {
        provider_id: Cypress.env('providerId'),
        date: date
    }

    cy.request({
        method: 'POST',
        url: apiServer + '/appointments',
        body: payload,
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then((response) => {
        expect(response.status).to.eq(200)
    })
})

Cypress.Commands.add('setProviderId', (providerEmail) => {

    cy.request({
        method: 'GET',
        url: apiServer + '/providers',
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then((response) => {
        expect(response.status).to.eq(200)

        const providerList = response.body

        providerList.forEach((provider) => {
            if (provider.email == providerEmail) {
                Cypress.env('providerId', provider.id)
            }
        })
    })
})

Cypress.Commands.add('apiLogin', (user, setLocalStorage = false) => {

    const payload = {
        email: user.email,
        password: user.password
    }

    cy.request({
        method: 'POST',
        url: apiServer + '/sessions',
        body: payload
    }).then((response) => {
        expect(response.status).to.eq(200)
        Cypress.env('apiToken', response.body.token)

        if (setLocalStorage) {
            const { token, user } = response.body

            window.localStorage.setItem('@Samurai:token', token)
            window.localStorage.setItem('@Samurai:user', JSON.stringify(user))
        }
    })

    if (setLocalStorage) {
        cy.visit('/dashboard')
    }
})