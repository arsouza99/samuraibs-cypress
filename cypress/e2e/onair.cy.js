

describe('samuraibs tests', () => {
    it('webapp should be online', () => {
        cy.visit('/')

        cy.title()
            .should('eq', 'Samurai Barbershop by QAninja')
    })
})
