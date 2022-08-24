import fpPage from '../support/pages/forgotpass'
import rpPage from '../support/pages/resetpass'

describe('recovery password', () => {

    let data

    before(() => {
        cy.fixture('recovery').then((recovery) => {
            data = recovery
        })
    })

    context('when user forgets password', () => {

        before(() => {
            cy.postUser(data)
        })

        it('should request password rescue via email', () => {
            fpPage.go()
            fpPage.form(data.email)
            fpPage.submit()

            const message = 'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada.'

            fpPage.toast.shouldHaveText(message)
        })
    })

    context('when user requests password rescue', () => {

        before(() => {
            cy.postUser(data)
            cy.recoveryPass(data.email)
        })

        it('should be able to enter a new password', () => {
            const token = Cypress.env('recoveryToken')

            rpPage.go(token)
            rpPage.form('abc123', 'abc123')
            rpPage.submit()

            const message = 'Agora você já pode logar com a sua nova senha secreta.'
            rpPage.toast.shouldHaveText(message)
        })
    })
})