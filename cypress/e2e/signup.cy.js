import signupPage from '../support/pages/signup'

describe('signup tests', () => {

    context('when user is newbie', () => {
        const user = {
            name: 'Anderson Souza',
            email: 'arouza99@gmail.com',
            password: 'pwd123'
        }

        before(() => {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('should register new user', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('when email already registered', () => {
        const user = {
            name: 'João Lucas',
            email: 'joao@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(() => {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).eq(200)
            })
        })

        it('should not register user', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('when input incorrect email', () => {
        const user = {
            name: 'Elizabeth Olsen',
            email: 'liza.yahoo.com',
            password: 'pwd123'
        }

        it('should display alert message', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('when input small passwords', () => {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(() => {
            signupPage.go()
        })

        passwords.forEach((p) => {
            it('should not register with password: ' + p, () => {
                const user = { name: 'Jason Friday', email: 'jason@gmail.com', password: p }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(() => {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context('when submit without fulfil fields', () => {

        const alertMessages = ['Nome é obrigatório', 'E-mail é obrigatório', 'Senha é obrigatória']

        before(() => {
            signupPage.go()
            signupPage.submit()
        })

        alertMessages.forEach((alert) => {
            it('should display alert message: ' + alert.toLowerCase(), () => {
                signupPage.alertHaveText(alert)
            })
        })
    })
})