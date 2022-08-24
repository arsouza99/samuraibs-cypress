import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('login', () => {

    context('when is a valid user', () => {

        const user = {
            name: 'Robson Jassa',
            email: 'jassa@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(() => {
            cy.postUser(user)
        })

        it('should log successfully', () => {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            dashPage.header.userLoggedIn(user.name)
        })
    })

    context('when is a valid user with an incorrect password', () => {

        let user = {
            name: 'Celso Kamura',
            email: 'kamura@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(() => {
            cy.postUser(user).then(() => {
                user.password = 'abc123'
            })
        })

        it('should notify credential error', () => {
            loginPage.go()
            loginPage.form(user)
            loginPage.submit()

            const message = 'Ocorreu um erro ao fazer login, verifique suas credenciais.'
            loginPage.toast.shouldHaveText(message)
        })
    })

    context('when is a invalid email', () => {

        const emails = [
            'bla.com.br',
            'yahoo.com',
            '@',
            'andy@'
        ]

        before(() => {
            loginPage.go()
        })

        emails.forEach((email) => {
            it('should not login with: ' + email, () => {
                const user = { email: email, password: 'pwd123' }

                loginPage.form(user)
                loginPage.submit()

                loginPage.alert.haveText('Informe um email válido')
            })
        })
    })

    context('when try login without fulfil fields', () => {

        const alertMessages = ['E-mail é obrigatório', 'Senha é obrigatória']

        before(() => {
            loginPage.go()
            loginPage.submit()
        })

        alertMessages.forEach((alert) => {
            it('should display alert message: ' + alert.toLowerCase(), () => {
                loginPage.alert.haveText(alert)
            })
        })
    })
})