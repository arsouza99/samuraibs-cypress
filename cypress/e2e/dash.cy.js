import dashpage from '../support/pages/dash'
import { customer, provider, appointment } from '../support/factories/dash'

describe('dashboard', () => {

    context('when the customer makes an appointment on the mobile app', () => {

        before(() => {
            cy.postUser(provider)

            cy.postUser(customer)
            cy.apiLogin(customer)

            cy.setProviderId(provider.email)
            cy.createAppointment(appointment.hour)
        })

        it('it should be displayed on the dashboard', () => {
            const date = Cypress.env('appointmentDate')

            //cy.uiLogin(provider)
            cy.apiLogin(provider, true)

            dashpage.calendarShouldBeVisible()
            dashpage.selectDay(date)
            dashpage.appointmentShouldBeVisible(customer, appointment.hour)
        })
    })
})