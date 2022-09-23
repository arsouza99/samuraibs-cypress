import loginpage from '../support/pages/login'
import dashpage from '../support/pages/dash'

describe('dashboard', () => {

    context('when the customer makes an appointment on the mobile app', () => {

        const data = {
            customer: {
                name: 'Nickki Sixx',
                email: 'sixx@motleycure.com',
                password: 'pwd123',
                is_provider: 'false'
            },
            provider: {
                name: 'Ramon Valdes',
                email: 'ramon@televisa.com',
                password: 'pwd123',
                is_provider: 'true'
            },
            appointmentHour: '14:00'
        }

        before(() => {
            cy.postUser(data.provider)

            cy.postUser(data.customer)
            cy.apiLogin(data.customer)

            cy.setProviderId(data.provider.email)
            cy.createAppointment(data.appointmentHour)
        })

        it('it should be displayed on the dashboard', () => {
            loginpage.go()
            loginpage.form(data.provider)
            loginpage.submit()

            dashpage.calendarShouldBeVisible()

            const day = Cypress.env('appointmentDay')
            dashpage.selectDay(day)

            dashpage.appointmentShouldBeVisible(data.customer, data.appointmentHour)
        })
    })
})