import signupPage from '../support/pages/signup'

describe('signup tests', () => {

    let success
    let emailDup
    let emailInv
    let shortPassword

    before(() => {
        cy.fixture('signup').then((signup) => {
            success = signup.success
            emailDup = signup.emailDup
            emailInv = signup.emailInv
            shortPassword = signup.shortPassword
        })
    })

    context('when user is newbie', () => {

        before(() => {
            cy.task('removeUser', success.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('should register new user', () => {
            signupPage.go()
            signupPage.form(success)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('when email already registered', () => {

        before(() => {
            cy.postUser(emailDup)
        })

        it('should not register user', () => {
            signupPage.go()
            signupPage.form(emailDup)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('when input incorrect email', () => {

        it('should display alert message', () => {
            signupPage.go()
            signupPage.form(emailInv)
            signupPage.submit()
            signupPage.alert.haveText('Informe um email válido')
        })
    })

    context('when input short passwords', () => {

        const passwords = ['1', '2a', 'ab3', 'abc4', 'ab#c5']

        beforeEach(() => {
            signupPage.go()
        })

        passwords.forEach((p) => {
            it('should not register with password: ' + p, () => {

                shortPassword.password = p

                signupPage.form(shortPassword)
                signupPage.submit()
            })
        })

        afterEach(() => {
            signupPage.alert.haveText('Pelo menos 6 caracteres')
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
                signupPage.alert.haveText(alert)
            })
        })
    })
})